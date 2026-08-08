"""Search tests."""
import pytest


def test_search_returns_matches(client, admin_headers):
    client.post('/api/admin/products', json={
        'name': 'Blue Hoodie Premium', 'category': 'Hoodies', 'price': 80, 'stock_quantity': 5
    }, headers=admin_headers)
    client.post('/api/admin/products', json={
        'name': 'Red Cargo Pants', 'category': 'Pants', 'price': 60, 'stock_quantity': 5
    }, headers=admin_headers)
    resp = client.get('/api/products/?search=Hoodie')
    assert resp.status_code == 200
    products = resp.get_json()['products']
    assert len(products) >= 1
    for p in products:
        assert 'hoodie' in p['name'].lower()


def test_search_case_insensitive(client, admin_headers):
    client.post('/api/admin/products', json={
        'name': 'Urban Tee', 'category': 'Tops', 'price': 30, 'stock_quantity': 5
    }, headers=admin_headers)
    resp = client.get('/api/products/?search=urban')
    assert resp.status_code == 200
    assert resp.get_json()['total'] >= 1


def test_search_no_results(client):
    resp = client.get('/api/products/?search=xyznonexistent')
    assert resp.status_code == 200
    assert resp.get_json()['total'] == 0


def test_search_empty_string(client):
    resp = client.get('/api/products/?search=')
    assert resp.status_code == 200


def test_search_combined_with_category(client, admin_headers):
    client.post('/api/admin/products', json={
        'name': 'Blue Hoodie', 'category': 'Hoodies', 'price': 80, 'stock_quantity': 5
    }, headers=admin_headers)
    client.post('/api/admin/products', json={
        'name': 'Blue Pants', 'category': 'Pants', 'price': 60, 'stock_quantity': 5
    }, headers=admin_headers)
    resp = client.get('/api/products/?search=Blue&category=Hoodies')
    assert resp.status_code == 200
    for p in resp.get_json()['products']:
        assert p['category'] == 'Hoodies'