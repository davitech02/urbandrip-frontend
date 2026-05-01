import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        stock_quantity: '',
        category: '',
        badge: '',
        material: '',
        care_instructions: '',
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
        is_active: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');

    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/products/all`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error('Failed to fetch products');
            
            const data = await response.json();
            setProducts(data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.category || !formData.price || !formData.description) {
            toast.error('Please fill in all required fields');
            return;
        }

        setSaving(true);

        try {
            // Prepare form data
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('category', formData.category);
            submitData.append('price', parseFloat(formData.price));
            submitData.append('original_price', formData.original_price || '');
            submitData.append('stock_quantity', parseInt(formData.stock_quantity || 0));
            submitData.append('badge', formData.badge);
            submitData.append('description', formData.description);
            submitData.append('material', formData.material);
            submitData.append('care_instructions', formData.care_instructions);
            submitData.append('sizes', formData.sizes);
            submitData.append('is_active', formData.is_active);
            
            // Add image file if selected
            if (imageFile) {
                submitData.append('image', imageFile);
            }
            
            // Add image URL if provided
            if (imageUrl) {
                submitData.append('image_url', imageUrl);
            }

            const method = editingId ? 'PUT' : 'POST';
            const endpoint = editingId ? `/products/${editingId}` : '/products/create';
            
            const response = await fetch(`${API_URL}${endpoint}`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: submitData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save product');
            }

            toast.success(data.message || 'Product saved successfully!');
            
            // Reset form
            setShowModal(false);
            setEditingId(null);
            setImageFile(null);
            setImagePreview(null);
            setImageUrl('');
            setFormData({
                name: '',
                description: '',
                price: '',
                original_price: '',
                stock_quantity: '',
                category: '',
                badge: '',
                material: '',
                care_instructions: '',
                sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
                is_active: true
            });
            
            // Refresh products
            await fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.message || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            original_price: product.original_price || '',
            stock_quantity: product.stock_quantity,
            category: product.category || '',
            badge: product.badge || '',
            material: product.material || '',
            care_instructions: product.care_instructions || '',
            sizes: JSON.stringify(product.sizes || []),
            is_active: product.is_active
        });
        if (product.images && product.images.length > 0) {
            setImagePreview(product.images[0]);
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete product');
            }

            toast.success('Product deleted successfully!');
            await fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            toast.error(error.message || 'Failed to delete product');
        }
    };

    if (loading) {
        return <div className="text-center py-20"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold">Products Management</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setImageFile(null);
                        setImagePreview(null);
                        setImageUrl('');
                        setFormData({
                            name: '',
                            description: '',
                            price: '',
                            original_price: '',
                            stock_quantity: '',
                            category: '',
                            badge: '',
                            material: '',
                            care_instructions: '',
                            sizes: JSON.stringify(["XS", "S", "M", "L", "XL", "XXL"]),
                            is_active: true
                        });
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-['Inter'] text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Product</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Category</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Price</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Stock</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-right font-['Inter'] text-sm font-bold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">{product.name}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">{product.category}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">₦{product.price.toLocaleString()}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">{product.stock_quantity}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(product)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No products found. Click "Add Product" to create one.
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="font-['Playfair_Display'] text-lg font-bold">
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Product Name *"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Price *"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Original Price"
                                    step="0.01"
                                    value={formData.original_price}
                                    onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Category *"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Stock Quantity"
                                    value={formData.stock_quantity}
                                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Badge (e.g., New, Sale)"
                                    value={formData.badge}
                                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Material"
                                    value={formData.material}
                                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <textarea
                                placeholder="Description *"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                required
                            />

                            <textarea
                                placeholder="Care Instructions"
                                value={formData.care_instructions}
                                onChange={(e) => setFormData({ ...formData, care_instructions: e.target.value })}
                                rows="2"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                            />

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium mb-2">Sizes (JSON array)</label>
                                <textarea
                                    value={formData.sizes}
                                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                                    rows="2"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            {/* Image Section */}
                            <div>
                                <label className="block font-['Inter'] text-sm font-medium mb-2">Product Image</label>
                                
                                {imagePreview && (
                                    <div className="mb-4 relative">
                                        <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImageFile(null);
                                                setImagePreview(null);
                                            }}
                                            className="mt-2 text-sm text-red-600 hover:text-red-700"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block font-['Inter'] text-xs font-medium mb-2">Upload File</label>
                                        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors block">
                                            <Image className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                            <span className="font-['Inter'] text-xs text-blue-600">Click to upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageSelect}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>

                                    <div>
                                        <label className="block font-['Inter'] text-xs font-medium mb-2">Or Paste URL</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <label className="flex items-center gap-2 font-['Inter'] text-sm">
                                <input
                                    type="checkbox"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    className="rounded"
                                />
                                Active Product
                            </label>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg font-['Inter'] font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    {saving ? 'Saving...' : (editingId ? 'Update Product' : 'Save Product')}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    disabled={saving}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-900 py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
