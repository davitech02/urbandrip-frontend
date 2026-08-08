import os
import tempfile
import uuid

# MUST be set before importing the app module so it overrides .env DATABASE_URL.
_tmpdir = tempfile.mkdtemp(prefix='urbandrip_test_')
os.environ['DATABASE_URL'] = 'sqlite:///' + os.path.join(_tmpdir, 'test.db').replace('\\', '/')
os.environ['JWT_SECRET_KEY'] = 'test-jwt-secret-long-enough-for-hmac-sha256-xxxxx'
os.environ['SECRET_KEY'] = 'test-flask-secret-long-enough-for-hmac-sha256-xxxxx'
os.environ['UPLOAD_FOLDER'] = os.path.join(_tmpdir, 'uploads')

import pytest
from app import app as flask_app
from database import db
from models import User, Category, DiscountCode, Order

@pytest.fixture(scope='session')
def app():
    return flask_app

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def admin_token(app, client):
    resp = client.post('/api/auth/login', json={
        'email': 'admin@gmail.com', 'password': 'admin1234'
    })
    assert resp.status_code == 200, resp.get_json()
    return resp.get_json()['token']

@pytest.fixture()
def admin_headers(admin_token):
    return {'Authorization': f'Bearer {admin_token}'}

@pytest.fixture()
def user(app, client):
    """Idempotent user fixture — registers if needed, returns user dict."""
    email = 'user@example.com'
    with app.app_context():
        existing = User.query.filter_by(email=email).first()
        if existing:
            return existing.to_dict()
    resp = client.post('/api/auth/register', json={
        'full_name': 'Test User', 'email': email,
        'password': 'password123', 'phone': '08012345678'
    })
    if resp.status_code == 201:
        return resp.get_json()['user']
    # Already exists — login to get data
    login = client.post('/api/auth/login', json={
        'email': email, 'password': 'password123'
    })
    return login.get_json()['user']

@pytest.fixture()
def user_token(app, client, user):
    resp = client.post('/api/auth/login', json={
        'email': user['email'], 'password': 'password123'
    })
    assert resp.status_code == 200, resp.get_json()
    return resp.get_json()['token']

@pytest.fixture()
def user_headers(user_token):
    return {'Authorization': f'Bearer {user_token}'}

@pytest.fixture()
def headers(client, user_headers):
    return user_headers

_created_product_seq = {'n': 0}

@pytest.fixture()
def product(app, client, admin_headers):
    _created_product_seq['n'] += 1
    n = _created_product_seq['n']
    payload = {
        'name': f'Test Hoodie {n}',
        'category': f'Hoodies{n}',
        'price': 55.5, 'original_price': 70.0,
        'description': 'A premium test hoodie',
        'sizes': '["S","M","L"]',
        'stock_quantity': 10, 'badge': 'New',
        'material': 'Cotton', 'is_active': 'true',
        'images': '["https://example.com/img.jpg"]'
    }
    resp = client.post('/api/admin/products', json=payload, headers=admin_headers)
    assert resp.status_code == 201, resp.get_json()
    return resp.get_json()['product']

@pytest.fixture()
def category(app, client, admin_headers):
    """Idempotent — uses unique name per fixture call."""
    name = f'TestCat_{uuid.uuid4().hex[:8]}'
    resp = client.post('/api/admin/categories', json={'name': name}, headers=admin_headers)
    assert resp.status_code == 201, resp.get_json()
    return resp.get_json()['category']

@pytest.fixture()
def discount_code(app, client, admin_headers):
    """Idempotent — uses unique code per fixture call."""
    code = f'SAVE{uuid.uuid4().hex[:6].upper()}'
    resp = client.post('/api/admin/discount-codes', json={
        'code': code, 'discount_percentage': 10, 'max_usage': 100
    }, headers=admin_headers)
    assert resp.status_code == 201, resp.get_json()
    return resp.get_json()