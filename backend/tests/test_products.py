"""Product CRUD tests."""
import pytest


def test_get_products_empty(client):
    resp = client.get('/api/products/')
    assert resp.status_code == 200
    body = resp.get_json()
    assert 'products' in body
    assert 'total' in body


def test_get_products_returns_list(client, product):
    resp = client.get('/api/products/')
    assert resp.status_code == 200
    assert resp.get_json()['total'] >= 1


def test_get_single_product(client, product):
    resp = client.get(f'/api/products/{product["id"]}')
    assert resp.status_code == 200
    body = resp.get_json()
    assert body['name'] == product['name']


def test_get_nonexistent_product(client):
    resp = client.get('/api/products/999999')
    assert resp.status_code == 404


def test_pagination(client, admin_headers):
    for i in range(6):
        client.post('/api/admin/products', json={
            'name': f'PageItem {i}', 'category': f'Tops{i}', 'price': 10 + i,
            'stock_quantity': 5
        }, headers=admin_headers)
    resp = client.get('/api/products/?page=1&limit=3')
    body = resp.get_json()
    assert body['total'] >= 6
    assert body['total_pages'] >= 2
    assert len(body['products']) == 3


def test_category_filter(client, product, admin_headers):
    client.post('/api/admin/products', json={
        'name': 'Jeans', 'category': 'Pants42', 'price': 40, 'stock_quantity': 5
    }, headers=admin_headers)
    resp = client.get(f'/api/products/?category={product["category"]}')
    assert resp.status_code == 200
    for p in resp.get_json()['products']:
        assert p['category'] == product['category']


def test_inactive_product_hidden(client, product, admin_headers):
    resp = client.get(f'/api/products/{product["id"]}')
    assert resp.status_code == 200
    client.delete(f'/api/admin/products/{product["id"]}', headers=admin_headers)
    resp2 = client.get(f'/api/products/{product["id"]}')
    assert resp2.status_code == 404


# ── Admin CRUD ────────────────────────────────────────────────────────

def test_admin_create_product(client, admin_headers):
    resp = client.post('/api/admin/products', json={
        'name': 'New Tee', 'category': 'Tops99', 'price': 25,
        'stock_quantity': 20, 'is_active': 'true'
    }, headers=admin_headers)
    assert resp.status_code == 201
    body = resp.get_json()
    assert body['product']['name'] == 'New Tee'
    assert body['product']['is_active'] is True


def test_admin_create_product_missing_fields(client, admin_headers):
    resp = client.post('/api/admin/products', json={'name': 'NoCat'},
                       headers=admin_headers)
    assert resp.status_code == 400


def test_admin_get_all_products(client, admin_headers, product):
    resp = client.get('/api/admin/products', headers=admin_headers)
    assert resp.status_code == 200
    body = resp.get_json()
    assert 'products' in body
    assert body['total'] >= 1


def test_admin_get_single_product(client, admin_headers, product):
    resp = client.get(f'/api/admin/products/{product["id"]}', headers=admin_headers)
    assert resp.status_code == 200
    body = resp.get_json()
    assert body['name'] == product['name']


def test_admin_update_product(client, admin_headers, product):
    resp = client.put(f'/api/admin/products/{product["id"]}', json={
        'name': 'Updated Hoodie', 'price': 60
    }, headers=admin_headers)
    assert resp.status_code == 200
    assert resp.get_json()['product']['name'] == 'Updated Hoodie'


def test_admin_update_product_stock_to_zero(client, admin_headers, product):
    resp = client.put(f'/api/admin/products/{product["id"]}', json={
        'stock_quantity': 0
    }, headers=admin_headers)
    assert resp.status_code == 200


def test_admin_delete_product_soft(client, admin_headers, product):
    resp = client.delete(f'/api/admin/products/{product["id"]}', headers=admin_headers)
    assert resp.status_code == 200
    resp2 = client.get(f'/api/admin/products/{product["id"]}', headers=admin_headers)
    assert resp2.get_json()['is_active'] is False


def test_admin_routes_require_admin(client, user_headers):
    resp = client.get('/api/admin/products', headers=user_headers)
    assert resp.status_code == 403
