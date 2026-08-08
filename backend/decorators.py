import logging
from functools import wraps

from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

logger = logging.getLogger('urbandrip.auth')


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()
        except Exception as e:
            logger.warning("JWT verification failed: %s", e)
            return jsonify({'error': f'Authorization failed: {str(e)}'}), 401

        try:
            from models import User
            user_id = int(get_jwt_identity())
            user = User.query.get(user_id)
            if not user or user.role != 'admin':
                logger.warning("Non-admin access attempt: user_id=%s role=%s", user_id, user.role if user else 'None')
                return jsonify({'error': 'Admin access required'}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            logger.error("Admin check failed: %s", e)
            return jsonify({'error': str(e)}), 500
    return wrapper
