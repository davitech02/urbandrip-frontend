"""Messages endpoints. NOTE: send_message requires @admin_required."""
import pytest


def test_send_message_as_admin(client, admin_headers, user):
    resp = client.post('/api/messages/send', json={
        'recipient_id': user['id'],
        'message': 'Welcome to Urban Drip!'
    }, headers=admin_headers)
    assert resp.status_code == 201
    body = resp.get_json()
    assert body['message'] == 'Message sent successfully'


def test_send_message_non_admin_rejected(client, user_headers):
    resp = client.post('/api/messages/send', json={
        'recipient_id': 1, 'message': 'Hello'
    }, headers=user_headers)
    assert resp.status_code == 403


def test_get_my_messages(client, admin_headers, user):
    client.post('/api/messages/send', json={
        'recipient_id': user['id'], 'message': 'Test msg'
    }, headers=admin_headers)
    from flask_jwt_extended import create_access_token
    with client.application.app_context():
        token = create_access_token(identity=str(user['id']))
    resp = client.get('/api/messages/my', headers={'Authorization': f'Bearer {token}'})
    assert resp.status_code == 200
    body = resp.get_json()
    assert isinstance(body['messages'], list)
    assert 'unread_count' in body


def test_mark_message_read(client, admin_headers, user):
    client.post('/api/messages/send', json={
        'recipient_id': user['id'], 'message': 'Read me'
    }, headers=admin_headers)
    from flask_jwt_extended import create_access_token
    with client.application.app_context():
        token = create_access_token(identity=str(user['id']))
    # Get message ID
    my_resp = client.get('/api/messages/my', headers={'Authorization': f'Bearer {token}'})
    msgs = my_resp.get_json()['messages']
    if msgs:
        mid = msgs[0]['id']
        resp = client.put(f'/api/messages/{mid}/read', headers={'Authorization': f'Bearer {token}'})
        assert resp.status_code == 200


def test_admin_get_all_messages(client, admin_headers, user):
    client.post('/api/messages/send', json={
        'recipient_id': user['id'], 'message': 'Admin msg'
    }, headers=admin_headers)
    resp = client.get('/api/messages/admin/all', headers=admin_headers)
    assert resp.status_code == 200
    assert 'messages' in resp.get_json()