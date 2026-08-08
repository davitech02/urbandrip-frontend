from flask import Blueprint, request, jsonify
from database import db
from models import Category
from decorators import admin_required

admin_categories_bp = Blueprint('admin_categories', __name__)

@admin_categories_bp.route('', methods=['GET'])
def get_categories():
    """Get all categories (public, no auth needed)"""
    try:
        categories = Category.query.order_by(Category.name).all()
        return jsonify({
            'categories': [c.to_dict() for c in categories]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_categories_bp.route('', methods=['POST'])
@admin_required
def create_category():
    """Create a new category (admin only)"""
    try:
        data = request.get_json()
        if not data or not data.get('name'):
            return jsonify({'error': 'Category name is required'}), 400

        existing = Category.query.filter_by(name=data['name'].strip()).first()
        if existing:
            return jsonify({'error': 'Category already exists'}), 409

        category = Category(
            name=data['name'].strip(),
            description=data.get('description', '').strip() or None,
            is_active=data.get('is_active', True)
        )
        db.session.add(category)
        db.session.commit()

        return jsonify({
            'message': 'Category created successfully',
            'category': category.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_categories_bp.route('/<int:category_id>', methods=['PUT'])
@admin_required
def update_category(category_id):
    """Update a category (admin only)"""
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404

        data = request.get_json()
        if data.get('name'):
            existing = Category.query.filter(
                Category.name == data['name'].strip(),
                Category.id != category_id
            ).first()
            if existing:
                return jsonify({'error': 'Category name already taken'}), 409
            category.name = data['name'].strip()
        if 'description' in data:
            category.description = data['description'].strip() or None
        if 'is_active' in data:
            category.is_active = bool(data['is_active'])

        db.session.commit()
        return jsonify({
            'message': 'Category updated successfully',
            'category': category.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_categories_bp.route('/<int:category_id>', methods=['DELETE'])
@admin_required
def delete_category(category_id):
    """Delete a category (admin only)"""
    try:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({'error': 'Category not found'}), 404
        db.session.delete(category)
        db.session.commit()
        return jsonify({'message': 'Category deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
