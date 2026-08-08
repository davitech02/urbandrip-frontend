"""Authentication tests: register, login, logout, me, profile, password."""
import pytest


# ── Register ──────────────────────────────────────────────────────────

def test_register_success(client):
    resp = client.post('/api/auth/register', json={
        'full_name': 'New User', 'email': 'new@test.com', 'password': 'pass1234'
    })
    assert resp.status_code == 201
    body = resp.get_json()
    assert 'token' in body
    assert body['user']['email'] == 'new@test.com'
    assert body['user']['full_name'] == 'New User'
    assert body['user']['role'] == 'user'


def test_register_duplicate_email(client):
    client.post('/api/auth/register', json={
        'full_name': 'A', 'email': 'dup@test.com', 'password': 'pass1234'
    })
    resp = client.post('/api/auth/register', json={
        'full_name': 'B', 'email': 'dup@test.com', 'password': 'pass1234'
    })
    assert resp.status_code == 409


def test_register_short_password(client):
    resp = client.post('/api/auth/register', json={
        'full_name': 'Short', 'email': 'short@test.com', 'password': '1234'
    })
    assert resp.status_code == 400


def test_register_missing_fields(client):
    resp = client.post('/api/auth/register', json={})
    assert resp.status_code == 400


def test_register_with_phone(client):
    resp = client.post('/api/auth/register', json={
        'full_name': 'Phone', 'email': 'phone@test.com',
        'password': 'pass1234', 'phone': '08012345678'
    })
    assert resp.status_code == 201
    assert resp.get_json()['user']['phone'] == '08012345678'


# ── Login ─────────────────────────────────────────────────────────────

def test_login_success(client, user):
    resp = client.post('/api/auth/login', json={
        'email': user['email'], 'password': 'password123'
    })
    assert resp.status_code == 200
    body = resp.get_json()
    assert 'token' in body
    assert body['user']['id'] == user['id']


def test_login_wrong_password(client, user):
    resp = client.post('/api/auth/login', json={
        'email': user['email'], 'password': 'wrongpassword'
    })
    assert resp.status_code == 401


def test_login_nonexistent_user(client):
    resp = client.post('/api/auth/login', json={
        'email': 'nobody@test.com', 'password': 'pass1234'
    })
    assert resp.status_code == 401


def test_login_disabled_account(client, admin_headers):
    resp = client.post('/api/auth/register', json={
        'full_name': 'Disabled', 'email': 'disabled@test.com', 'password': 'pass1234'
    })
    uid = resp.get_json()['user']['id']
    from models import User
    with client.application.app_context():
        u = User.query.get(uid)
        u.is_active = False
        from database import db
        db.session.commit()
    resp2 = client.post('/api/auth/login', json={
        'email': 'disabled@test.com', 'password': 'pass1234'
    })
    assert resp2.status_code == 403
    # Re-enable so it doesn't leak state to other tests
    with client.application.app_context():
        u = User.query.get(uid)
        u.is_active = True
        from database import db
        db.session.commit()


def test_login_updates_last_login(client, user):
    client.post('/api/auth/login', json={
        'email': user['email'], 'password': 'password123'
    })
    from models import User
    with client.application.app_context():
        u = User.query.get(user['id'])
        assert u.last_login is not None


# ── /me ───────────────────────────────────────────────────────────────

def test_me_authenticated(client, user_headers, user):
    resp = client.get('/api/auth/me', headers=user_headers)
    assert resp.status_code == 200
    assert resp.get_json()['user']['email'] == user['email']


def test_me_unauthenticated(client):
    resp = client.get('/api/auth/me')
    assert resp.status_code == 401


def test_me_invalid_token(client):
    resp = client.get('/api/auth/me', headers={'Authorization': 'Bearer bad-token'})
    assert resp.status_code in (401, 422)


# ── Logout (token blocklist) ─────────────────────────────────────────

def test_logout_invalidates_token(client, user_token):
    resp = client.post('/api/auth/logout', headers={'Authorization': f'Bearer {user_token}'})
    assert resp.status_code == 200
    resp2 = client.get('/api/auth/me', headers={'Authorization': f'Bearer {user_token}'})
    assert resp2.status_code == 401


def test_logout_no_token_returns_200(client):
    resp = client.post('/api/auth/logout')
    assert resp.status_code == 200


# ── Update profile ────────────────────────────────────────────────────

def test_update_profile(client, user_headers):
    resp = client.put('/api/auth/update-profile', json={
        'full_name': 'Updated Name', 'phone': '08099999999'
    }, headers=user_headers)
    assert resp.status_code == 200
    assert resp.get_json()['user']['full_name'] == 'Updated Name'


def test_update_profile_name_only(client, user_headers):
    resp = client.put('/api/auth/update-profile', json={
        'full_name': 'Just Name'
    }, headers=user_headers)
    assert resp.status_code == 200
    assert resp.get_json()['user']['full_name'] == 'Just Name'


# ── Change password ───────────────────────────────────────────────────

def test_change_password_success(client, user_headers):
    resp = client.put('/api/auth/change-password', json={
        'current_password': 'password123', 'new_password': 'newpass123'
    }, headers=user_headers)
    assert resp.status_code == 200
    login = client.post('/api/auth/login', json={
        'email': 'user@example.com', 'password': 'newpass123'
    })
    assert login.status_code == 200
    # Change password back so subsequent tests aren't affected
    new_token = login.get_json()['token']
    client.put('/api/auth/change-password', json={
        'current_password': 'newpass123', 'new_password': 'password123'
    }, headers={'Authorization': f'Bearer {new_token}'})


def test_change_password_wrong_current(client, user_headers):
    resp = client.put('/api/auth/change-password', json={
        'current_password': 'wrong', 'new_password': 'newpass123'
    }, headers=user_headers)
    assert resp.status_code in (400, 401)


def test_change_password_short_new(client, user_headers):
    resp = client.put('/api/auth/change-password', json={
        'current_password': 'password123', 'new_password': 'short'
    }, headers=user_headers)
    assert resp.status_code == 400


# ── Admin access via user token ───────────────────────────────────────

def test_admin_routes_reject_user_token(client, user_headers):
    for path in ['/api/admin/products', '/api/admin/settings',
                 '/api/admin/customers']:
        resp = client.get(path, headers=user_headers)
        assert resp.status_code == 403, f"{path} should be 403 for user role"