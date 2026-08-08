from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from database import db
from models import Product
from decorators import admin_required
import os
import time
import logging

logger = logging.getLogger('urbandrip.products')

products_bp = Blueprint('products', __name__)

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
UPLOAD_FOLDER = 'static/uploads'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# ============= PUBLIC ENDPOINTS =============

@products_bp.route('/', methods=['GET'])
def get_products():
    """Get active products - public endpoint, supports ?category=, ?page=, ?limit=, ?search="""
    try:
        query = Product.query.filter_by(is_active=True).order_by(Product.created_at.desc())
        
        category = request.args.get('category')
        if category:
            query = query.filter_by(category=category)
        
        search = request.args.get('search', '').strip()
        if search:
            query = query.filter(Product.name.ilike(f'%{search}%'))
        
        # Pagination
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        limit = min(limit, 100)
        
        total = query.count()
        total_pages = max(1, (total + limit - 1) // limit)
        page = min(page, total_pages)
        
        products = query.offset((page - 1) * limit).limit(limit).all()
        
        return jsonify({
            'products': [p.to_dict() for p in products],
            'total': total,
            'page': page,
            'total_pages': total_pages,
            'limit': limit
        }), 200
    except Exception as e:
        logger.error("Get products error: %s", e)
        return jsonify({'error': str(e)}), 500

@products_bp.route('/<int:id>', methods=['GET'])
def get_product(id):
    """Get single product details - public"""
    try:
        product = Product.query.get_or_404(id)
        
        if not product.is_active:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@products_bp.route('/upload-image', methods=['POST'])
@admin_required
def upload_image():
    """Upload product image - admin only"""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400

        file = request.files['image']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed. Use PNG, JPG, JPEG, GIF, or WEBP'}), 400

        filename = f"{int(time.time() * 1000)}_{secure_filename(file.filename)}"
        upload_folder = os.path.join(os.getcwd(), 'static', 'uploads')
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        image_url = f"{request.host_url}static/uploads/{filename}"

        return jsonify({
            'message': 'Image uploaded successfully',
            'url': image_url,
            'filename': filename
        }), 200

    except Exception as e:
        logger.error("Image upload error: %s", e)
        return jsonify({'error': str(e)}), 500
