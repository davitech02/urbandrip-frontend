from flask import Blueprint, request, jsonify
from database import db, bcrypt
from models import User, TokenBlocklist
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timedelta
import logging

logger = logging.getLogger('urbandrip.auth')

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        full_name = data.get('full_name', '').strip()
        email = data.get('email', '').strip().lower()
        phone = data.get('phone', '').strip()
        password = data.get('password', '')

        # Validate
        if not full_name or not email or not password:
            return jsonify({'error': 'Full name, email and password are required'}), 400

        if len(password) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), 400

        # Check if email exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409

        # Hash password
        password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

        # Create user
        new_user = User(
            full_name=full_name,
            email=email,
            phone=phone,
            password_hash=password_hash
        )
        db.session.add(new_user)
        db.session.commit()

        # Generate token
        token = create_access_token(
            identity=str(new_user.id),
            expires_delta=timedelta(days=7)
        )

        return jsonify({
            'message': 'Account created successfully',
            'token': token,
            'user': new_user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        logger.error("Registration error: %s", e)
        return jsonify({'error': 'Registration failed. Please try again.'}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        email = data.get('email', '').strip().lower()
        password = data.get('password', '')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        # Find user
        user = User.query.filter_by(email=email).first()

        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Invalid email or password'}), 401

        if not user.is_active:
            return jsonify({'error': 'Account has been disabled. Contact support.'}), 403

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        # Generate token
        token = create_access_token(
            identity=str(user.id),
            expires_delta=timedelta(days=7)
        )

        return jsonify({
            'message': 'Login successful',
            'token': token,
            'user': user.to_dict()
        }), 200

    except Exception as e:
        logger.error("Login error: %s", e)
        return jsonify({'error': 'Login failed. Please try again.'}), 500


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required(optional=True)
def logout():
    try:
        jti = get_jwt().get('jti')
        if jti:
            blocklisted = TokenBlocklist.query.filter_by(jti=jti).first()
            if not blocklisted:
                db.session.add(TokenBlocklist(jti=jti))
                db.session.commit()
        return jsonify({"msg": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"msg": "Logged out successfully"}), 200


@auth_bp.route('/update-profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        if data.get('full_name', '').strip():
            user.full_name = data['full_name'].strip()
        if data.get('phone') is not None:
            user.phone = data['phone'].strip()

        db.session.commit()
        return jsonify({'message': 'Profile updated successfully', 'user': user.to_dict()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/change-password', methods=['PUT'])
@jwt_required()
def change_password():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(int(user_id))
        if not user:
            return jsonify({'error': 'User not found'}), 404

        data = request.get_json()
        current_password = data.get('current_password', '')
        new_password = data.get('new_password', '')

        if not current_password or not new_password:
            return jsonify({'error': 'Current and new password are required'}), 400

        if not bcrypt.check_password_hash(user.password_hash, current_password):
            return jsonify({'error': 'Current password is incorrect'}), 401

        if len(new_password) < 8:
            return jsonify({'error': 'New password must be at least 8 characters'}), 400

        user.password_hash = bcrypt.generate_password_hash(new_password).decode('utf-8')
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500