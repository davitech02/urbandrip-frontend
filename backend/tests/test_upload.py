"""Image upload tests."""
import io
import pytest


def _fake_image(name='test.png', ext='png'):
    """Create a minimal in-memory PNG file."""
    # Minimal valid PNG: 8-byte signature + 13-byte IHDR chunk
    png_bytes = (
        b'\x89PNG\r\n\x1a\n'  # PNG signature
        b'\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01'
        b'\x08\x02\x00\x00\x00\x90wS\xde'
        b'\x00\x00\x00\x0cIDATx'
        b'\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x18\xd8N'
        b'\x00\x00\x00\x00IEND\xaeB`\x82'
    )
    return io.BytesIO(png_bytes), name


def test_upload_image_success(client, admin_headers):
    data_stream, filename = _fake_image()
    resp = client.post('/api/products/upload-image',
                       data={'image': (data_stream, filename)},
                       content_type='multipart/form-data',
                       headers=admin_headers)
    assert resp.status_code == 200
    body = resp.get_json()
    assert 'url' in body
    assert 'static/uploads' in body['url']


def test_upload_wrong_extension(client, admin_headers):
    data_stream = io.BytesIO(b'not an image')
    resp = client.post('/api/products/upload-image',
                       data={'image': (data_stream, 'file.txt')},
                       content_type='multipart/form-data',
                       headers=admin_headers)
    assert resp.status_code == 400


def test_upload_no_file(client, admin_headers):
    resp = client.post('/api/products/upload-image',
                       data={},
                       headers=admin_headers)
    assert resp.status_code == 400


def test_upload_requires_admin(client, user_headers):
    data_stream, filename = _fake_image()
    resp = client.post('/api/products/upload-image',
                       data={'image': (data_stream, filename)},
                       content_type='multipart/form-data',
                       headers=user_headers)
    assert resp.status_code == 403


def test_upload_jpeg(client, admin_headers):
    data_stream = io.BytesIO(b'\xff\xd8\xff\xe0' + b'\x00' * 100)
    resp = client.post('/api/products/upload-image',
                       data={'image': (data_stream, 'photo.jpg')},
                       content_type='multipart/form-data',
                       headers=admin_headers)
    assert resp.status_code == 200


def test_upload_webp(client, admin_headers):
    data_stream = io.BytesIO(b'RIFF\x00\x00\x00\x00WEBP')
    resp = client.post('/api/products/upload-image',
                       data={'image': (data_stream, 'pic.webp')},
                       content_type='multipart/form-data',
                       headers=admin_headers)
    assert resp.status_code == 200


def test_serve_uploaded_file(client, admin_headers):
    data_stream, filename = _fake_image('upload_test.png')
    resp = client.post('/api/products/upload-image',
                       data={'image': (data_stream, filename)},
                       content_type='multipart/form-data',
                       headers=admin_headers)
    assert resp.status_code == 200
    url = resp.get_json()['url']
    path = url.split('://')[-1].split('/', 1)[-1]
    resp2 = client.get(f'/{path}')
    assert resp2.status_code == 200