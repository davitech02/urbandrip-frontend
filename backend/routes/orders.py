from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from database import db
from models import Order, User
from decorators import admin_required
import logging

logger = logging.getLogger('urbandrip.orders')

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/create', methods=['POST'])
def create_order_guest():
    """Create order for guest or authenticated user - no auth required"""
    try:
        data = request.get_json(silent=True)

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Optionally extract user_id from JWT if token is provided
        linked_user_id = None
        try:
            verify_jwt_in_request(optional=True)
            identity = get_jwt_identity()
            if identity:
                linked_user_id = int(identity)
        except Exception:
            pass

        # Extract delivery address and items (db.JSON handles serialization)
        delivery_address = data.get('delivery_address', {})
        items_data = data.get('items', [])

        new_order = Order(
            user_id=linked_user_id,
            customer_name=data.get('customer_name'),
            customer_email=data.get('customer_email'),
            customer_phone=data.get('customer_phone'),
            delivery_address=delivery_address,
            items=items_data,
            subtotal=data.get('subtotal', 0),
            shipping_fee=data.get('shipping_fee', 0),
            discount=data.get('discount', 0),
            total_amount=data.get('total_amount', 0),
            delivery_method=data.get('delivery_method', 'standard'),
            tx_ref=data.get('tx_ref'),
            flutterwave_ref=data.get('flutterwave_ref'),
            payment_status=data.get('payment_status', 'pending'),
            order_status='processing'
        )
        
        db.session.add(new_order)
        db.session.commit()
        
        return jsonify({
            'message': 'Order created successfully',
            'order_id': new_order.id,
            'tx_ref': new_order.tx_ref
        }), 201
        
    except Exception as e:
        db.session.rollback()
        logger.error("Error creating order: %s", e)
        return jsonify({'error': 'Failed to create order. Please try again.'}), 500


@orders_bp.route('/<int:order_id>', methods=['GET'])
def get_order(order_id):
    """Get single order by ID"""
    try:
        order = Order.query.get(order_id)

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        items = order.items or []
        delivery_address = order.delivery_address or {}

        return jsonify({
            'order': {
                'id': order.id,
                'customer_name': order.customer_name,
                'customer_email': order.customer_email,
                'customer_phone': order.customer_phone,
                'total_amount': order.total_amount,
                'payment_status': order.payment_status,
                'order_status': order.order_status,
                'delivery_method': order.delivery_method,
                'tx_ref': order.tx_ref,
                'items': items,
                'delivery_address': delivery_address,
                'created_at': order.created_at.isoformat()
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@orders_bp.route('/track/<tx_ref>', methods=['GET'])
def track_order(tx_ref):
    """Get order by transaction reference"""
    try:
        order = Order.query.filter_by(tx_ref=tx_ref).first()

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        items = order.items or []
        delivery_address = order.delivery_address or {}

        return jsonify({
            'order': {
                'id': order.id,
                'tx_ref': order.tx_ref,
                'customer_name': order.customer_name,
                'customer_email': order.customer_email,
                'customer_phone': order.customer_phone,
                'total_amount': order.total_amount,
                'payment_status': order.payment_status,
                'order_status': order.order_status,
                'delivery_method': order.delivery_method,
                'items': items,
                'delivery_address': delivery_address,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat() if order.updated_at else None
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@orders_bp.route('/user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user_orders(user_id):
    """Get all orders for authenticated user"""
    try:
        current_user = get_jwt_identity()

        # Only allow users to view their own orders
        if int(current_user) != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()

        output = []
        for order in orders:
            items = order.items or []
            delivery_address = order.delivery_address or {}

            output.append({
                'id': order.id,
                'tx_ref': order.tx_ref,
                'customer_name': order.customer_name,
                'customer_email': order.customer_email,
                'customer_phone': order.customer_phone,
                'total_amount': order.total_amount,
                'payment_status': order.payment_status,
                'order_status': order.order_status,
                'delivery_method': order.delivery_method,
                'items': items,
                'delivery_address': delivery_address,
                'created_at': order.created_at.isoformat(),
                'updated_at': order.updated_at.isoformat() if order.updated_at else None
            })

        return jsonify({'orders': output}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@orders_bp.route('/<int:order_id>/status', methods=['PUT'])
@admin_required
def admin_update_order_status(order_id):
    """Update order status with tracking history (admin only)"""
    try:
        data = request.get_json()
        new_status = data.get('status')
        tracking_note = data.get('tracking_note', '')

        if not new_status:
            return jsonify({'error': 'Status is required'}), 400

        order = Order.query.get(order_id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        # Add tracking entry
        order.add_tracking_entry(new_status, tracking_note)

        return jsonify({
            'message': 'Order status updated successfully',
            'order': order.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/admin/all', methods=['GET'])
@admin_required
def get_all_orders():
    """Get all orders (admin only) — includes user info"""
    try:
        status_filter = request.args.get('status')
        
        query = Order.query.order_by(Order.created_at.desc())
        
        if status_filter:
            query = query.filter_by(order_status=status_filter)
        
        orders = query.all()
        
        result = []
        for order in orders:
            d = order.to_dict()
            user = User.query.get(order.user_id) if order.user_id else None
            d['user'] = user.to_dict() if user else None
            result.append(d)
        
        return jsonify({
            'orders': result
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@orders_bp.route('/admin/detail/<int:order_id>', methods=['GET'])
@admin_required
def admin_get_order_details(order_id):
    """Get detailed order information (admin only)"""
    try:
        order = Order.query.get(order_id)

        if not order:
            return jsonify({'error': 'Order not found'}), 404

        return jsonify({
            'order': order.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500