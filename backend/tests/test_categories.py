"""Category CRUD tests."""
import pytest
import uuid


def test_get_categories(client, category):
    resp = client.get('/api/admin/categories')
    assert resp.status_code == 200
    cats = resp.get_json()
    assert len(cats) >= 1


def test_get_categories_public(client, category):
    """GET /api/admin/categories is actually public (no auth required)."""
    resp = client.get('/api/admin/categories')
    assert resp.status_code == 200


def test_create_category(client, admin_headers):
    name = f'Footwear_{uuid.uuid4().hex[:6]}'
    resp = client.post('/api/admin/categories', json={
        'name': name, 'description': 'Shoes and sandals'
    }, headers=admin_headers)
    assert resp.status_code == 201
    assert resp.get_json()['category']['name'] == name


def test_create_category_duplicate(client, admin_headers):
    name = f'DupCat_{uuid.uuid4().hex[:6]}'
    client.post('/api/admin/categories', json={'name': name}, headers=admin_headers)
    resp = client.post('/api/admin/categories', json={'name': name}, headers=admin_headers)
    assert resp.status_code == 409


def test_create_category_missing_name(client, admin_headers):
    resp = client.post('/api/admin/categories', json={}, headers=admin_headers)
    assert resp.status_code == 400


def test_update_category(client, admin_headers, category):
    resp = client.put(f'/api/admin/categories/{category["id"]}', json={
        'name': f'UpdatedCat_{uuid.uuid4().hex[:6]}'
    }, headers=admin_headers)
    assert resp.status_code == 200


def test_delete_category(client, admin_headers, category):
    resp = client.delete(f'/api/admin/categories/{category["id"]}', headers=admin_headers)
    assert resp.status_code == 200


def test_delete_nonexistent_category(client, admin_headers):
    resp = client.delete('/api/admin/categories/999999', headers=admin_headers)
    assert resp.status_code == 404


def test_category_routes_require_admin(client, user_headers):
    resp = client.post('/api/admin/categories', json={'name': 'Nope'},
                       headers=user_headers)
    assert resp.status_code == 403
