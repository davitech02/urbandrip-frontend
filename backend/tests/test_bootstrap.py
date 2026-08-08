"""Application bootstrap + API response contract tests."""
import pytest


def test_health_returns_ok(client):
    resp = client.get('/api/health')
    assert resp.status_code == 200
    body = resp.get_json()
    assert body.get('status') == 'ok'
    assert 'database' in body


def test_admin_verify_requires_auth(client):
    resp = client.get('/api/admin/verify')
    assert resp.status_code == 401


def test_admin_verify_detects_admin(client, admin_headers):
    resp = client.get('/api/admin/verify', headers=admin_headers)
    assert resp.status_code == 200
    body = resp.get_json()
    assert body.get('exists') is True
    assert body.get('role') == 'admin'


def test_404_returns_json(client):
    resp = client.get('/api/does-not-exist')
    assert resp.status_code == 404
    assert resp.is_json


def test_cors_headers_present_for_api(client):
    resp = client.options('/api/products/')
    assert resp.status_code in (200, 204)
    cors = resp.headers.get('Access-Control-Allow-Origin')
    assert cors is not None


def test_unknown_route_json_shape(client):
    resp = client.get('/api/nope/xyz')
    body = resp.get_json()
    assert isinstance(body, dict)


def test_static_upload_404_json(client):
    resp = client.get('/static/uploads/missing-file-does-not-exist.png')
    assert resp.status_code == 404
