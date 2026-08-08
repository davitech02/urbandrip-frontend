from flask import Blueprint, request, jsonify
from database import db
from models import Product
from decorators import admin_required
from datetime import datetime
import os
import json
import time
from werkzeug.utils import secure_filename
import logging

logger = logging.getLogger('urbandrip.admin_products')

admin_products_bp = Blueprint('admin_products', __name__)

UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_upload_folder():
    """Ensure uploads folder exists"""
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ============= ADMIN PRODUCT ENDPOINTS =============

@admin_products_bp.route('', methods=['GET'])
@admin_required
def get_all_products():
    """Get all products including inactive (admin only)"""
    try:
        products = Product.query.order_by(Product.created_at.desc()).all()
        return jsonify({
            'products': [product.to_dict(include_inactive=True) for product in products],
            'total': len(products)
        }), 200
    except Exception as e:
        logger.error("Get all products error: %s", e)
        return jsonify({'error': str(e)}), 500

@admin_products_bp.route('/<int:product_id>', methods=['GET'])
@admin_required
def get_product(product_id):
    """Get a single product (admin only)"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({'error': 'Product not found'}), 404
        
        return jsonify(product.to_dict(include_inactive=True)), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_products_bp.route('', methods=['POST'])
@admin_required
def create_product():
    """Create a new product (admin only)"""
    try:
        ensure_upload_folder()
        
        # Handle both JSON and FormData
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
            files = request.files
        else:
            data = request.get_json() or {}
            files = None

        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Product name is required'}), 400
        if not data.get('category'):
            return jsonify({'error': 'Category is required'}), 400
        if not data.get('price'):
            return jsonify({'error': 'Price is required'}), 400

        # Type conversions
        name = str(data.get('name', '')).strip()
        category = str(data.get('category', '')).strip()
        price = float(data.get('price', 0))
        
        original_price_raw = data.get('original_price')
        original_price = float(original_price_raw) if original_price_raw and original_price_raw != '' else None
        
        badge = str(data.get('badge')) if data.get('badge') and data.get('badge') != 'None' else None
        description = str(data.get('description', '')).strip()
        material = str(data.get('material', '')).strip() if data.get('material') else None
        care_instructions = str(data.get('care_instructions', '')).strip() if data.get('care_instructions') else None
        
        try:
            stock_quantity = int(data.get('stock_quantity', 0))
        except (ValueError, TypeError):
            stock_quantity = 0
        stock_quality = str(data.get('stock_quality', '')).strip() if data.get('stock_quality') else None

        # Fix sizes — must be stored as JSON string in database
        sizes_raw = data.get('sizes', '[]')
        if isinstance(sizes_raw, str):
            try:
                sizes_list = json.loads(sizes_raw)
                sizes = json.dumps(sizes_list)
            except:
                sizes = json.dumps([])
        else:
            sizes = json.dumps(sizes_raw if isinstance(sizes_raw, list) else [])

        # Fix is_active boolean
        is_active_raw = data.get('is_active', True)
        if isinstance(is_active_raw, str):
            is_active = is_active_raw.lower() in ['true', '1', 'yes']
        else:
            is_active = bool(is_active_raw)

        # Handle images — accept JSON array from frontend, file upload, or single url
        images_list = []
        if data.get('images'):
            if isinstance(data['images'], str):
                try:
                    images_list = json.loads(data['images'])
                except:
                    images_list = [data['images']]
            elif isinstance(data['images'], list):
                images_list = data['images']
        if files and 'image' in files:
            file = files['image']
            if file and file.filename and allowed_file(file.filename):
                filename = f"{int(time.time())}_{secure_filename(file.filename)}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                host_url = request.host_url.rstrip('/')
                image_url = f"{host_url}/static/uploads/{filename}"
                images_list.append(image_url)
        if not images_list and data.get('image_url'):
            images_list.append(str(data.get('image_url')))
        
        images = json.dumps(images_list)

        # Create product
        new_product = Product(
            name=name,
            category=category,
            price=price,
            original_price=original_price,
            badge=badge,
            description=description,
            sizes=sizes,
            images=images,
            material=material,
            care_instructions=care_instructions,
            stock_quantity=stock_quantity,
            stock_quality=stock_quality,
            is_active=is_active
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            'message': 'Product created successfully',
            'product': new_product.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error("Create product error: %s", e, exc_info=True)
        return jsonify({'error': 'Failed to create product. Please try again.'}), 500

@admin_products_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    """Update product (admin only)"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
            
        ensure_upload_folder()
        
        # Handle both JSON and FormData
        if request.content_type and 'multipart/form-data' in request.content_type:
            data = request.form.to_dict()
            files = request.files
        else:
            data = request.get_json() or {}
            files = None
        
        # Update string fields
        if data.get('name'):
            product.name = str(data.get('name')).strip()
        if data.get('category'):
            product.category = str(data.get('category')).strip()
        if data.get('description'):
            product.description = str(data.get('description')).strip()
        
        # Update numeric fields
        if data.get('price'):
            product.price = float(data.get('price'))
        if data.get('original_price'):
            product.original_price = float(data.get('original_price'))
        if data.get('stock_quantity'):
            product.stock_quantity = int(data.get('stock_quantity'))
        
        # Update optional string fields
        if data.get('badge'):
            product.badge = str(data.get('badge'))
        if data.get('material'):
            product.material = str(data.get('material')).strip()
        if data.get('care_instructions'):
            product.care_instructions = str(data.get('care_instructions')).strip()
        if 'stock_quality' in data:
            stock_q = data.get('stock_quality')
            product.stock_quality = str(stock_q).strip() if stock_q else None
        
        # Update sizes
        if data.get('sizes'):
            sizes_raw = data.get('sizes')
            if isinstance(sizes_raw, str):
                try:
                    sizes_list = json.loads(sizes_raw)
                    product.sizes = json.dumps(sizes_list)
                except:
                    product.sizes = json.dumps([])
            else:
                product.sizes = json.dumps(sizes_raw if isinstance(sizes_raw, list) else [])
        
        # Update is_active
        if 'is_active' in data:
            is_active_raw = data.get('is_active')
            if isinstance(is_active_raw, str):
                product.is_active = is_active_raw.lower() in ['true', '1', 'yes']
            else:
                product.is_active = bool(is_active_raw)
        
        # Handle images — accept JSON array to replace, or file upload / single url to append
        if data.get('images'):
            if isinstance(data['images'], str):
                try:
                    product.images = json.dumps(json.loads(data['images']))
                except:
                    product.images = json.dumps([data['images']])
            elif isinstance(data['images'], list):
                product.images = json.dumps(data['images'])
        elif files and 'image' in files:
            file = files['image']
            if file and file.filename and allowed_file(file.filename):
                filename = f"{int(time.time())}_{secure_filename(file.filename)}"
                filepath = os.path.join(UPLOAD_FOLDER, filename)
                file.save(filepath)
                host_url = request.host_url.rstrip('/')
                image_url = f"{host_url}/static/uploads/{filename}"
                images_list = json.loads(product.images) if product.images else []
                images_list.append(image_url)
                product.images = json.dumps(images_list)
        elif data.get('image_url'):
            images_list = json.loads(product.images) if product.images else []
            images_list.append(str(data.get('image_url')))
            product.images = json.dumps(images_list)
        
        product.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error("Update product error: %s", e)
        return jsonify({'error': 'Failed to update product. Please try again.'}), 500

@admin_products_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    """Soft delete product (admin only)"""
    try:
        product = Product.query.get(product_id)
        if not product:
            return jsonify({'error': 'Product not found'}), 404
            
        product.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        logger.error("Delete product error: %s", e)
        return jsonify({'error': str(e)}), 500

