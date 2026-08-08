"""Admin dashboard, visitors, settings, activity feed."""
import pytest


# ── Admin stats ───────────────────────────────────────────────────────

def test_admin_stats(client, admin_headers):
    resp = client.get('/api/admin/stats', headers=admin_headers)
    assert resp.status_code == 200
    body = resp.get_json()
    assert 'products' in body
    assert 'orders' in body


def test_admin_activity(client, admin_headers):
    resp = client.get('/api/admin/activity', headers=admin_headers)
    assert resp.status_code == 200
    assert isinstance(resp.get_json()['activities'], list)


def test_admin_activity_limit(client, admin_headers):
    resp = client.get('/api/admin/activity?limit=5', headers=admin_headers)
    assert resp.status_code == 200


# ── Settings ──────────────────────────────────────────────────────────

def test_get_settings(client, admin_headers):
    resp = client.get('/api/admin/settings', headers=admin_headers)
    assert resp.status_code == 200


def test_update_settings(client, admin_headers):
    resp = client.put('/api/admin/settings', json={
        'key': 'store_name', 'value': 'Urban Drip Test'
    }, headers=admin_headers)
    assert resp.status_code == 200


def test_settings_require_admin(client, user_headers):
    resp = client.get('/api/admin/settings', headers=user_headers)
    assert resp.status_code == 403


# ── Visitors ──────────────────────────────────────────────────────────

def test_track_visitor(client):
    resp = client.post('/api/visitors/track', json={
        'visitor_id': 'vtest-001', 'page_url': '/shop',
        'device_type': 'desktop', 'browser': 'Chrome'
    })
    assert resp.status_code == 201


def test_visitor_stats(client, admin_headers):
    client.post('/api/visitors/track', json={
        'visitor_id': 'vstat-001', 'page_url': '/'
    })
    resp = client.get('/api/admin/visitors/stats', headers=admin_headers)
    assert resp.status_code == 200


def test_visitor_recent(client, admin_headers):
    client.post('/api/visitors/track', json={
        'visitor_id': 'vrecent-001', 'page_url': '/about'
    })
    resp = client.get('/api/admin/visitors/recent', headers=admin_headers)
    assert resp.status_code == 200


def test_visitor_routes_require_admin(client, user_headers):
    resp = client.get('/api/admin/visitors/stats', headers=user_headers)
    assert resp.status_code == 403


# ── Admin customer management ─────────────────────────────────────────

def test_admin_get_customers(client, admin_headers, user):
    resp = client.get('/api/admin/customers', headers=admin_headers)
    assert resp.status_code == 200
    assert len(resp.get_json()['customers']) >= 2


def test_admin_get_customer_detail(client, admin_headers, user):
    resp = client.get(f'/api/admin/customers/{user["id"]}', headers=admin_headers)
    assert resp.status_code == 200


def test_admin_toggle_customer_status(client, admin_headers, user):
    resp = client.put(f'/api/admin/customers/{user["id"]}/status', headers=admin_headers)
    assert resp.status_code == 200
    body = resp.get_json()
    assert body['is_active'] is False
    resp2 = client.put(f'/api/admin/customers/{user["id"]}/status', headers=admin_headers)
    assert resp2.get_json()['is_active'] is True


def test_customer_routes_require_admin(client, user_headers):
    resp = client.get('/api/admin/customers', headers=user_headers)
    assert resp.status_code == 403
