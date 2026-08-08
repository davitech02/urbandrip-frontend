"""Discount codes + validate-discount (checkout flow)."""
import pytest
import uuid


def test_validate_discount_valid(client, discount_code):
    code = discount_code['code']['code']
    resp = client.get(f'/api/validate-discount/{code}')
    assert resp.status_code == 200
    body = resp.get_json()
    assert body['valid'] is True
    assert body['discount_percentage'] == 10


def test_validate_discount_case_insensitive(client, discount_code):
    code = discount_code['code']['code'].lower()
    resp = client.get(f'/api/validate-discount/{code}')
    assert resp.status_code == 200
    assert resp.get_json()['valid'] is True


def test_validate_discount_invalid(client):
    resp = client.get('/api/validate-discount/NOPE')
    assert resp.status_code == 404
    assert resp.get_json()['valid'] is False


def test_admin_create_discount(client, admin_headers):
    code_name = f'D{uuid.uuid4().hex[:6].upper()}'
    resp = client.post('/api/admin/discount-codes', json={
        'code': code_name, 'discount_percentage': 20, 'max_usage': 50
    }, headers=admin_headers)
    assert resp.status_code == 201
    body = resp.get_json()
    assert body['code']['code'] == code_name


def test_admin_create_discount_duplicate(client, admin_headers, discount_code):
    existing = discount_code['code']['code']
    resp = client.post('/api/admin/discount-codes', json={
        'code': existing.lower(), 'discount_percentage': 15
    }, headers=admin_headers)
    assert resp.status_code == 400


def test_admin_get_discounts(client, admin_headers, discount_code):
    resp = client.get('/api/admin/discount-codes', headers=admin_headers)
    assert resp.status_code == 200
    assert len(resp.get_json()) >= 1


def test_admin_update_discount(client, admin_headers, discount_code):
    code_id = discount_code['code']['id']
    resp = client.put(f'/api/admin/discount-codes/{code_id}', json={
        'discount_percentage': 25
    }, headers=admin_headers)
    assert resp.status_code == 200
    assert resp.get_json()['code']['discount_percentage'] == 25


def test_admin_delete_discount(client, admin_headers, discount_code):
    code_id = discount_code['code']['id']
    resp = client.delete(f'/api/admin/discount-codes/{code_id}', headers=admin_headers)
    assert resp.status_code == 200


def test_discount_routes_require_admin(client, user_headers):
    resp = client.post('/api/admin/discount-codes', json={
        'code': f'X{uuid.uuid4().hex[:6]}', 'discount_percentage': 10
    }, headers=user_headers)
    assert resp.status_code == 403
