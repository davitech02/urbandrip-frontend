import logging
import os
from datetime import datetime

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('urbandrip')


def _extra_origins():
    """Parse optional ALLOWED_ORIGINS from env (comma-separated list)."""
    raw = os.environ.get('ALLOWED_ORIGINS', '')
    return [o.strip() for o in raw.split(',') if o.strip()]


def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///urbandrip.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    jwt_secret = os.environ.get('JWT_SECRET_KEY')
    if not jwt_secret:
        jwt_secret = os.urandom(64).hex()
        logger.warning("JWT_SECRET_KEY not set — using random key. Sessions will invalidate on restart.")
    app.config['JWT_SECRET_KEY'] = jwt_secret

    flask_secret = os.environ.get('SECRET_KEY')
    if not flask_secret:
        flask_secret = os.urandom(64).hex()
        logger.warning("SECRET_KEY not set — using random key. Cookies will invalidate on restart.")
    app.config['SECRET_KEY'] = flask_secret

    os.makedirs('static/uploads', exist_ok=True)

    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://localhost:3000",
                "http://localhost:8000",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:3000",
                "http://127.0.0.1:8000",
                "https://urbandrip-app.vercel.app",
                *_extra_origins(),
            ],
            "methods": ["GET", "POST", "PUT", "DELETE"],
            "allow_headers": ["Content-Type", "Authorization"],
            "max_age": 3600
        }
    })

    from database import db, bcrypt, jwt as jwt_manager
    db.init_app(app)
    bcrypt.init_app(app)
    jwt_manager.init_app(app)

    from routes.auth import auth_bp
    from routes.orders import orders_bp
    from routes.products import products_bp
    from routes.visitors import visitors_bp
    from routes.settings import settings_bp
    from routes.admin_customers import admin_customers_bp
    from routes.admin_products import admin_products_bp
    from routes.messages import messages_bp
    from routes.admin_categories import admin_categories_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(visitors_bp, url_prefix='/api/visitors')
    app.register_blueprint(settings_bp, url_prefix='/api')
    app.register_blueprint(admin_customers_bp, url_prefix='/api/admin/customers')
    app.register_blueprint(admin_products_bp, url_prefix='/api/admin/products')
    app.register_blueprint(admin_categories_bp, url_prefix='/api/admin/categories')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')

    from models import User, Product, Order, Visitor, Settings, DiscountCode, Message, Category, TokenBlocklist

    @jwt_manager.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload['jti']
        return TokenBlocklist.query.filter_by(jti=jti).first() is not None

    # --- Security headers ---
    @app.after_request
    def set_security_headers(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
        response.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
        if request.is_secure:
            response.headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains'
        return response

    # --- Caching for static assets ---
    @app.after_request
    def set_cache_headers(response):
        path = request.path
        if path.startswith('/static/') or path.endswith(('.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.woff2')):
            response.headers['Cache-Control'] = 'public, max-age=31536000, immutable'
        elif path.startswith('/api/'):
            response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate'
        return response

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request', 'details': str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized', 'details': str(error)}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden', 'details': str(error)}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found', 'details': str(error)}), 404

    @app.errorhandler(500)
    def internal_error(error):
        logger.error("Internal server error: %s", error)
        return jsonify({'error': 'Internal server error'}), 500

    @app.route('/api/health', methods=['GET'])
    def health():
        try:
            db.session.execute(db.text('SELECT 1'))
            return jsonify({'status': 'ok', 'database': 'connected'}), 200
        except Exception as e:
            return jsonify({'status': 'error', 'database': str(e)}), 500

    @app.route('/static/uploads/<filename>', methods=['GET'])
    def serve_upload(filename):
        return send_from_directory('static/uploads', filename)

    # --- Admin dashboard routes (unique to app.py) ---
    from decorators import admin_required

    @app.route('/api/admin/verify', methods=['GET'])
    @admin_required
    def verify_admin():
        admin_user = User.query.filter_by(email="admin@gmail.com").first()
        return jsonify({
            'exists': admin_user is not None,
            'role': admin_user.role if admin_user else None
        }), 200

    @app.route('/api/admin/orders', methods=['GET'])
    @admin_required
    def admin_list_orders():
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
            return jsonify({'orders': result}), 200
        except Exception as e:
            logger.error("Error listing admin orders: %s", e)
            return jsonify({'error': 'Failed to list orders'}), 500

    @app.route('/api/admin/orders/<int:order_id>/status', methods=['PUT'])
    @admin_required
    def admin_update_order_status_alias(order_id):
        try:
            data = request.get_json()
            new_status = data.get('status')
            tracking_note = data.get('tracking_note', '')
            if not new_status:
                return jsonify({'error': 'Status is required'}), 400
            order = Order.query.get(order_id)
            if not order:
                return jsonify({'error': 'Order not found'}), 404
            order.add_tracking_entry(new_status, tracking_note)
            return jsonify({'message': 'Order status updated successfully', 'order': order.to_dict()}), 200
        except Exception as e:
            db.session.rollback()
            logger.error("Error updating order status: %s", e)
            return jsonify({'error': 'Failed to update order status'}), 500

    @app.route('/api/admin/visitors/stats', methods=['GET'])
    @admin_required
    def admin_visitors_stats_alias():
        from sqlalchemy import func
        try:
            now = datetime.utcnow()
            today = now.replace(hour=0, minute=0, second=0, microsecond=0)
            week_ago = today - __import__('datetime').timedelta(days=7)
            month_ago = today - __import__('datetime').timedelta(days=30)

            total_visits = Visitor.query.count()
            total_visits_today = Visitor.query.filter(Visitor.timestamp >= today).count()
            total_visits_week = Visitor.query.filter(Visitor.timestamp >= week_ago).count()
            total_visits_month = Visitor.query.filter(Visitor.timestamp >= month_ago).count()

            unique_month = db.session.query(func.count(func.distinct(Visitor.visitor_id))).filter(
                Visitor.timestamp >= month_ago
            ).scalar() or 0

            device_stats = db.session.query(
                Visitor.device_type, func.count(Visitor.id)
            ).filter(Visitor.timestamp >= month_ago).group_by(Visitor.device_type).all()
            device_breakdown = {(s[0] or 'unknown'): s[1] for s in device_stats}

            top_pages = db.session.query(
                Visitor.page_url, func.count(Visitor.id)
            ).filter(Visitor.timestamp >= month_ago).group_by(Visitor.page_url).order_by(
                func.count(Visitor.id).desc()
            ).limit(5).all()

            daily_visits = []
            for i in range(6, -1, -1):
                day = today - __import__('datetime').timedelta(days=i)
                next_day = day + __import__('datetime').timedelta(days=1)
                count = Visitor.query.filter(Visitor.timestamp >= day, Visitor.timestamp < next_day).count()
                daily_visits.append({'date': day.strftime('%b %d'), 'visits': count})

            return jsonify({
                'total_visits': total_visits,
                'today_visits': total_visits_today,
                'week_visits': total_visits_week,
                'month_visits': total_visits_month,
                'unique_visitors': unique_month,
                'device_breakdown': device_breakdown,
                'top_pages': [{'page': p[0], 'visits': p[1]} for p in top_pages],
                'daily_visits': daily_visits
            }), 200
        except Exception as e:
            logger.error("Error fetching visitor stats: %s", e)
            return jsonify({'error': 'Failed to fetch visitor stats'}), 500

    @app.route('/api/admin/visitors/recent', methods=['GET'])
    @admin_required
    def admin_visitors_recent_alias():
        try:
            limit = request.args.get('limit', 50, type=int)
            visits = Visitor.query.order_by(Visitor.timestamp.desc()).limit(limit).all()
            visit_list = [v.to_dict() for v in visits]
            return jsonify({'recent': visit_list, 'visits': visit_list}), 200
        except Exception as e:
            logger.error("Error fetching recent visitors: %s", e)
            return jsonify({'error': 'Failed to fetch recent visitors'}), 500

    @app.route('/api/admin/activity', methods=['GET'])
    @admin_required
    def get_activity_feed():
        try:
            limit = request.args.get('limit', 20, type=int)
            activities = []
            for u in User.query.filter(User.role != 'admin').order_by(User.created_at.desc()).limit(10).all():
                activities.append({'type': 'signup', 'message': f'{u.full_name} created an account', 'timestamp': u.created_at.isoformat(), 'icon': 'user'})
            for o in Order.query.order_by(Order.created_at.desc()).limit(10).all():
                activities.append({'type': 'order', 'message': f'New order #{o.id} — ₦{o.total_amount:,.0f} by {o.customer_name}', 'timestamp': o.created_at.isoformat(), 'icon': 'shopping-bag'})
            activities.sort(key=lambda x: x['timestamp'], reverse=True)
            return jsonify({'activities': activities[:limit]}), 200
        except Exception as e:
            logger.error("Error fetching activity feed: %s", e)
            return jsonify({'error': 'Failed to fetch activity feed'}), 500

    @app.route('/api/admin/stats', methods=['GET'])
    @admin_required
    def get_admin_stats():
        try:
            today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
            total_products = Product.query.count()
            active_products = Product.query.filter_by(is_active=True).count()
            total_orders = Order.query.count()
            orders_today = Order.query.filter(Order.created_at >= today).count()
            successful_orders = Order.query.filter_by(payment_status='successful').all()
            total_revenue = sum(o.total_amount for o in successful_orders)
            revenue_today = sum(o.total_amount for o in successful_orders if o.created_at >= today)
            total_customers = User.query.filter(User.role != 'admin').count()
            total_visitors = Visitor.query.count()
            visitors_today = Visitor.query.filter(Visitor.timestamp >= today).count()
            return jsonify({
                'products': {'total': total_products, 'active': active_products, 'inactive': total_products - active_products},
                'orders': {'total': total_orders, 'today': orders_today},
                'revenue': {'total': round(total_revenue, 2), 'today': round(revenue_today, 2)},
                'customers': {'total': total_customers},
                'visitors': {'total': total_visitors, 'today': visitors_today}
            }), 200
        except Exception as e:
            logger.error("Error fetching admin stats: %s", e)
            return jsonify({'error': 'Failed to fetch admin stats'}), 500

    with app.app_context():
        db.create_all()
        logger.info("Database tables created")

        admin_user = User.query.filter_by(email="admin@gmail.com").first()
        if not admin_user:
            hashed_password = bcrypt.generate_password_hash("admin1234").decode('utf-8')
            admin_user = User(
                full_name="ADMIN", email="admin@gmail.com", phone="08000000000",
                password_hash=hashed_password, role="admin", is_active=True
            )
            db.session.add(admin_user)
            db.session.commit()
            logger.info("Admin user created (admin@gmail.com)")
        elif admin_user.role != 'admin':
            admin_user.role = 'admin'
            db.session.commit()
            logger.info("Admin role updated for existing user")

    return app


app = create_app()

if __name__ == '__main__':
    debug = os.environ.get('FLASK_DEBUG', 'false').lower() == 'true'
    port = int(os.environ.get('PORT', 8000))
    app.run(debug=debug, port=port, host='0.0.0.0')
