"""Order creation, tracking, user orders, and checkout flow."""
import pytest
import uuid


def _order_payload(**overrides):
    """Build a unique order payload (unique tx_ref by default)."""
    base = {
        'customer_name': 'John Buyer',
        'customer_email': 'john@test.com',
        'customer_phone': '08011111111',
        'delivery_address': {'street': '12 Main St', 'city': 'Lagos', 'state': 'Lagos', 'zip': '100001'},
        'items': [{'name': 'Hoodie', 'price': 55, 'quantity': 2, 'size': 'L'}],
        'subtotal': 110,
        'shipping_fee': 5,
        'total_amount': 115,
        'delivery_method': 'standard',
        'tx_ref': f'TX-{uuid.uuid4().hex[:10]}'
    }
    base.update(overrides)
    return base


def test_create_order_guest(client):
    resp = client.post('/api/orders/create', json=_order_payload())
    assert resp.status_code == 201
    body = resp.get_json()
    assert 'order_id' in body
    assert 'tx_ref' in body


def test_create_order_missing_fields(client):
    resp = client.post('/api/orders/create', json={})
    assert resp.status_code == 400


def test_create_order_empty_body(client):
    resp = client.post('/api/orders/create', json={})
    assert resp.status_code == 400


def test_get_order(client):
    payload = _order_payload()
    create = client.post('/api/orders/create', json=payload)
    oid = create.get_json()['order_id']
    resp = client.get(f'/api/orders/{oid}')
    assert resp.status_code == 200
    body = resp.get_json()
    assert body['order']['customer_name'] == 'John Buyer'


def test_get_order_not_found(client):
    resp = client.get('/api/orders/999999')
    assert resp.status_code == 404


def test_track_order(client):
    payload = _order_payload()
    create = client.post('/api/orders/create', json=payload)
    tx_ref = create.get_json()['tx_ref']
    resp = client.get(f'/api/orders/track/{tx_ref}')
    assert resp.status_code == 200
    assert resp.get_json()['order']['tx_ref'] == tx_ref


def test_track_order_not_found(client):
    resp = client.get('/api/orders/track/NONEXISTENT')
    assert resp.status_code == 404


def test_user_orders(client, user, user_headers):
    token = user_headers['Authorization'].split(' ')[1]
    payload = _order_payload(customer_email=user['email'], customer_name=user['full_name'])
    client.post('/api/orders/create', json=payload,
                headers={'Authorization': f'Bearer {token}'})
    resp = client.get(f'/api/orders/user/{user["id"]}', headers=user_headers)
    assert resp.status_code == 200
    assert isinstance(resp.get_json()['orders'], list)


def test_user_orders_wrong_user(client, user_headers):
    resp = client.get('/api/orders/user/999999', headers=user_headers)
    assert resp.status_code == 403


def test_order_links_to_user(client, user, user_headers):
    token = user_headers['Authorization'].split(' ')[1]
    payload = _order_payload(customer_email=user['email'])
    resp = client.post('/api/orders/create', json=payload,
                       headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 201
    oid = resp.get_json()['order_id']
    from models import Order
    with client.application.app_context():
        order = Order.query.get(oid)
        assert order.user_id == user['id']


# ── Admin order management ────────────────────────────────────────────

def test_admin_all_orders(client, admin_headers):
    client.post('/api/orders/create', json=_order_payload())
    resp = client.get('/api/orders/admin/all', headers=admin_headers)
    assert resp.status_code == 200
    assert 'orders' in resp.get_json()


def test_admin_update_order_status(client, admin_headers):
    create = client.post('/api/orders/create', json=_order_payload())
    oid = create.get_json()['order_id']
    resp = client.put(f'/api/admin/orders/{oid}/status', json={
        'status': 'shipped', 'tracking_note': 'In transit'
    }, headers=admin_headers)
    assert resp.status_code == 200


def test_admin_order_detail(client, admin_headers):
    create = client.post('/api/orders/create', json=_order_payload())
    oid = create.get_json()['order_id']
    resp = client.get(f'/api/orders/admin/detail/{oid}', headers=admin_headers)
    assert resp.status_code == 200
    assert 'order' in resp.get_json()


def test_admin_orders_require_admin(client, user_headers):
    resp = client.get('/api/orders/admin/all', headers=user_headers)
    assert resp.status_code == 403
