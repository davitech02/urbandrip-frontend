import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category: '',
        badge: '',
        material: '',
        sizes: '["XS", "S", "M", "L", "XL", "XXL"]',
        is_active: true
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await API.get('/admin/products');
            setProducts(res.data.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            // Show empty list on error
            setProducts([]);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock_quantity: parseInt(formData.stock_quantity),
                sizes: JSON.parse(formData.sizes)
            };

            if (editingId) {
                await API.put(`/admin/products/${editingId}`, payload);
            } else {
                await API.post('/admin/products', payload);
            }

            // Upload image if provided
            if (imageFile) {
                const imgFormData = new FormData();
                imgFormData.append('image', imageFile);
                await API.post('/admin/products/upload-image', imgFormData);
            }

            setShowModal(false);
            setEditingId(null);
            setFormData({
                name: '', description: '', price: '', stock_quantity: '',
                category: '', badge: '', material: '', sizes: '["XS", "S", "M", "L", "XL", "XXL"]',
                is_active: true
            });
            setImageFile(null);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock_quantity: product.stock_quantity,
            category: product.category || '',
            badge: product.badge || '',
            material: product.material || '',
            sizes: JSON.stringify(product.sizes || []),
            is_active: product.is_active
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await API.delete(`/admin/products/${id}`);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    if (loading) return <div className="text-center py-20">Loading products...</div>;

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold">Products Management</h2>
                <button
                    onClick={() => {
                        setEditingId(null);
                        setFormData({
                            name: '', description: '', price: '', stock_quantity: '',
                            category: '', badge: '', material: '', sizes: '["XS", "S", "M", "L", "XL", "XXL"]',
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
                                    placeholder="Product Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Price"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="number"
                                    placeholder="Stock Quantity"
                                    value={formData.stock_quantity}
                                    onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="3"
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

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium mb-2">Product Image</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files[0])}
                                        className="hidden"
                                        id="image-input"
                                    />
                                    <label htmlFor="image-input" className="cursor-pointer font-['Inter'] text-sm text-blue-600">
                                        Click to upload image
                                    </label>
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
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                                >
                                    {editingId ? 'Update Product' : 'Add Product'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-['Inter'] font-medium transition-colors"
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
