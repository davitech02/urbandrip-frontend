from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models import Message, User
from decorators import admin_required

messages_bp = Blueprint('messages', __name__)


@messages_bp.route('/send', methods=['POST'])
@admin_required
def send_message():
    """Admin sends a message to a specific user"""
    try:
        data = request.get_json()
        recipient_id = data.get('recipient_id')
        subject = data.get('subject', '').strip()
        message_text = data.get('message', '').strip()
        order_id = data.get('order_id')

        if not recipient_id or not message_text:
            return jsonify({'error': 'recipient_id and message are required'}), 400

        recipient = User.query.get(recipient_id)
        if not recipient:
            return jsonify({'error': 'Recipient user not found'}), 404

        sender_id = int(get_jwt_identity())

        msg = Message(
            sender_id=sender_id,
            recipient_id=recipient_id,
            subject=subject or 'Message from Urban Drip',
            message=message_text,
            order_id=order_id
        )
        db.session.add(msg)
        db.session.commit()

        return jsonify({'message': 'Message sent successfully', 'id': msg.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@messages_bp.route('/my', methods=['GET'])
@jwt_required()
def get_my_messages():
    """Get all messages for the currently logged-in user"""
    try:
        user_id = int(get_jwt_identity())
        messages = Message.query.filter_by(recipient_id=user_id).order_by(Message.timestamp.desc()).all()
        unread_count = Message.query.filter_by(recipient_id=user_id, is_read=False).count()

        return jsonify({
            'messages': [m.to_dict(include_sender_name=True) for m in messages],
            'unread_count': unread_count
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@messages_bp.route('/<int:message_id>/read', methods=['PUT'])
@jwt_required()
def mark_as_read(message_id):
    """Mark a message as read"""
    try:
        user_id = int(get_jwt_identity())
        msg = Message.query.get(message_id)

        if not msg:
            return jsonify({'error': 'Message not found'}), 404

        if msg.recipient_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403

        msg.is_read = True
        db.session.commit()
        return jsonify({'message': 'Marked as read'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@messages_bp.route('/admin/all', methods=['GET'])
@admin_required
def get_all_messages():
    """Admin: get all messages sent, optionally filter by recipient"""
    try:
        recipient_id = request.args.get('recipient_id', type=int)

        query = Message.query.order_by(Message.timestamp.desc())
        if recipient_id:
            query = query.filter_by(recipient_id=recipient_id)

        messages = query.all()
        return jsonify({
            'messages': [m.to_dict(include_sender_name=True, include_recipient_name=True) for m in messages]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
