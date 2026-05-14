import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit2, Trash2, Image } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProducts = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        original_price: '',
        stock_quantity: 100,
        stock_quality: '',
        category: '',
        badge: '',
        material: '',
        care_instructions: '',
        sizes: ["XS", "S", "M", "L", "XL", "XXL"],
        is_active: true
    });
    const [imageFile, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState('');
    const [productImages, setProductImages] = useState([null, null, null, null, null]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState(['', '', '', '', '']);

    const API_URL = import.meta.env.VITE_API_URL;

    // Helper function to get image from product
    const getImage = (product) => {
        try {
            const imgs = typeof product.images === 'string'
                ? JSON.parse(product.images)
                : product.images;
            return Array.isArray(imgs) && imgs.length > 0
                ? imgs[0]
                : 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&h=100&fit=crop';
        } catch {
            return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&h=100&fit=crop';
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_URL}/api/admin/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            
            const data = await response.json();
            setProducts(data.products || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message || 'Failed to load products');
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
            // Upload all images first
            const uploadedImageUrls = [];

            for (let i = 0; i < productImages.length; i++) {
                const imageFile = productImages[i];
                if (!imageFile) continue;

                const imageFormData = new FormData();
                imageFormData.append('image', imageFile);

                const uploadRes = await fetch(
                    `${API_URL}/api/products/upload-image`,
                    {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: imageFormData
                    }
                );

                // Check content-type before parsing JSON
                const contentType = uploadRes.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await uploadRes.text();
                    console.error(`Upload failed with status ${uploadRes.status}: ${text}`);
                    throw new Error(`Image upload failed: ${uploadRes.status} - Invalid response format`);
                }

                const uploadData = await uploadRes.json();
                
                if (!uploadRes.ok) {
                    throw new Error(uploadData.error || `Upload failed: ${uploadRes.status}`);
                }

                if (uploadData.url) {
                    uploadedImageUrls.push(uploadData.url);
                } else {
                    throw new Error('Upload response missing image URL');
                }
            }

            // Now create the product with all image URLs
            const normalizedSizes = Array.isArray(formData.sizes)
                ? formData.sizes
                : (typeof formData.sizes === 'string'
                    ? (() => {
                        try {
                            return JSON.parse(formData.sizes);
                        } catch {
                            return ["XS", "S", "M", "L", "XL", "XXL"];
                        }
                    })()
                    : []);

            const productPayload = {
                name: formData.name,
                category: formData.category,
                price: parseFloat(formData.price),
                original_price: formData.original_price ? parseFloat(formData.original_price) : null,
                badge: formData.badge || null,
                description: formData.description,
                material: formData.material,
                stock_quality: formData.stock_quality,
                stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity, 10) : 100,
                care_instructions: formData.care_instructions,
                sizes: normalizedSizes.length > 0 ? normalizedSizes : ["XS", "S", "M", "L", "XL", "XXL"],
                images: uploadedImageUrls,
                is_active: formData.is_active !== false
            };

            const method = editingId ? 'PUT' : 'POST';
            const endpoint = editingId ? `${API_URL}/api/admin/products/${editingId}` : `${API_URL}/api/admin/products`;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productPayload)
            });

            // Validate content-type for product creation response too
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error(`Product save failed with status ${response.status}: ${text}`);
                throw new Error(`Product save failed: ${response.status} - Invalid response format`);
            }

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
            setProductImages([null, null, null, null, null]);
            setImagePreviewUrls(['', '', '', '', '']);
            setFormData({
                name: '',
                description: '',
                price: '',
                original_price: '',
                stock_quantity: 100,
                stock_quality: '',
                category: '',
                badge: '',
                material: '',
                care_instructions: '',
                sizes: ["XS", "S", "M", "L", "XL", "XXL"],
                is_active: true
            });
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (product) => {
        setEditingId(product.id);
        const newImagePreviewUrls = ['', '', '', '', ''];
        const newProductImages = [null, null, null, null, null];
        
        // Populate image preview URLs
        let existingImages = [];
        if (product.images) {
            existingImages = Array.isArray(product.images)
                ? product.images
                : (() => {
                    try {
                        return JSON.parse(product.images);
                    } catch {
                        return [];
                    }
                })();
        }
        existingImages.forEach((img, idx) => {
            if (idx < 5) {
                newImagePreviewUrls[idx] = img;
            }
        });
        
        setImagePreviewUrls(newImagePreviewUrls);
        setProductImages(newProductImages);
        
        const productSizes = typeof product.sizes === 'string'
            ? (() => {
                try {
                    return JSON.parse(product.sizes);
                } catch {
                    return ["XS", "S", "M", "L", "XL", "XXL"];
                }
            })()
            : product.sizes || ["XS", "S", "M", "L", "XL", "XXL"];

        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            original_price: product.original_price || '',
            stock_quantity: product.stock_quantity || 100,
            stock_quality: product.stock_quality || '',
            category: product.category || '',
            badge: product.badge || '',
            material: product.material || '',
            care_instructions: product.care_instructions || '',
            sizes: productSizes,
            is_active: product.is_active
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/products/${id}`, {
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
        return (
            <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
        );
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
                        setProductImages([null, null, null, null, null]);
                        setImagePreviewUrls(['', '', '', '', '']);
                        setFormData({
                            name: '',
                            description: '',
                            price: '',
                            original_price: '',
                            stock_quantity: 100,
                            stock_quality: '',
                            category: '',
                            badge: '',
                            material: '',
                            care_instructions: '',
                            sizes: ["XS", "S", "M", "L", "XL", "XXL"],
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

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 font-['Inter']">
                    {error}
                </div>
            )}

            {/* Search and Filter */}
            <div className="mb-6 flex gap-4">
                <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500"
                />
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Image</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Product</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Category</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Price</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Badge</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Stock</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-right font-['Inter'] text-sm font-bold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <img 
                                        src={getImage(product)} 
                                        alt={product.name}
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                </td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900 font-medium">{product.name}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">{product.category}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">
                                    ₦{product.price?.toLocaleString() || '0'}
                                    {product.original_price && (
                                        <span className="ml-2 text-xs text-gray-500 line-through">₦{product.original_price?.toLocaleString()}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {product.badge ? (
                                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                                            product.badge === 'Sale' ? 'bg-red-100 text-red-800' :
                                            product.badge === 'New' ? 'bg-black text-white' :
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {product.badge}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">—</span>
                                    )}
                                </td>
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
                {filteredProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        {products.length === 0 
                            ? 'No products found. Click "Add Product" to create one.'
                            : 'No products match your search. Try different filters.'}
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
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 font-['Inter'] text-sm focus:outline-none focus:border-black"
                                >
                                    <option value="">Select Category *</option>
                                    <option value="T-Shirts">T-Shirts</option>
                                    <option value="Polos">Polos</option>
                                    <option value="Hoodies">Hoodies</option>
                                    <option value="Pants & Shorts">Pants & Shorts</option>
                                    <option value="Shirts">Shirts</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Ankara/Native">Ankara/Native</option>
                                    <option value="Agbada">Agbada</option>
                                    <option value="Senator">Senator</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                                <select
                                    value={formData.stock_quality}
                                    onChange={(e) => setFormData({ ...formData, stock_quality: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 font-['Inter'] text-sm focus:outline-none focus:border-black"
                                >
                                    <option value="">Select Stock Quality</option>
                                    <option value="Premium Essentials">Premium Essentials</option>
                                    <option value="Luxury Streetwear">Luxury Streetwear</option>
                                    <option value="Heavyweight Collection">Heavyweight Collection</option>
                                    <option value="Signature Quality">Signature Quality</option>
                                    <option value="Tailored Premium">Tailored Premium</option>
                                    <option value="Elite Fabric Series">Elite Fabric Series</option>
                                    <option value="Crafted Collection">Crafted Collection</option>
                                    <option value="Studio Quality">Studio Quality</option>
                                    <option value="Limited Premium Drop">Limited Premium Drop</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Badge (e.g., New, Sale)"
                                    value={formData.badge}
                                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                />
                                <select
                                    value={formData.material}
                                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                    className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select Material</option>
                                    <optgroup label="Cotton">
                                        <option value="100% Cotton">100% Cotton</option>
                                        <option value="Combed Cotton">Combed Cotton</option>
                                        <option value="Ring-Spun Cotton">Ring-Spun Cotton</option>
                                        <option value="Organic Cotton">Organic Cotton</option>
                                        <option value="Heavyweight Cotton">Heavyweight Cotton</option>
                                        <option value="Slub Cotton">Slub Cotton</option>
                                        <option value="Pima Cotton">Pima Cotton</option>
                                        <option value="Supima Cotton">Supima Cotton</option>
                                        <option value="Ultra Soft Cotton">Ultra Soft Cotton</option>
                                    </optgroup>
                                    <optgroup label="Polyester">
                                        <option value="Polyester">Polyester</option>
                                        <option value="Microfiber Polyester">Microfiber Polyester</option>
                                        <option value="Performance Polyester">Performance Polyester</option>
                                        <option value="Moisture-Wicking Polyester">Moisture-Wicking Polyester</option>
                                        <option value="Recycled Polyester">Recycled Polyester</option>
                                    </optgroup>
                                    <optgroup label="Blends">
                                        <option value="Cotton-Poly Blend">Cotton-Poly Blend</option>
                                        <option value="Cotton-Spandex">Cotton-Spandex</option>
                                        <option value="Poly-Spandex">Poly-Spandex</option>
                                        <option value="Tri-Blend Fabric">Tri-Blend Fabric</option>
                                        <option value="Cotton-Fleece Blend">Cotton-Fleece Blend</option>
                                    </optgroup>
                                    <optgroup label="Luxury Fabrics">
                                        <option value="Silk">Silk</option>
                                        <option value="Cashmere">Cashmere</option>
                                        <option value="Merino Wool">Merino Wool</option>
                                        <option value="Mohair">Mohair</option>
                                        <option value="Velvet">Velvet</option>
                                        <option value="Satin">Satin</option>
                                        <option value="Suede">Suede</option>
                                        <option value="Leather">Leather</option>
                                    </optgroup>
                                    <optgroup label="Fleece & Knit">
                                        <option value="French Terry">French Terry</option>
                                        <option value="Fleece Fabric">Fleece Fabric</option>
                                        <option value="Brushed Fleece">Brushed Fleece</option>
                                        <option value="Loopback Cotton">Loopback Cotton</option>
                                        <option value="Heavyweight Jersey">Heavyweight Jersey</option>
                                        <option value="Interlock Fabric">Interlock Fabric</option>
                                        <option value="Ribbed Knit">Ribbed Knit</option>
                                    </optgroup>
                                    <optgroup label="Performance Fabrics">
                                        <option value="Nylon">Nylon</option>
                                        <option value="Spandex/Elastane">Spandex/Elastane</option>
                                        <option value="Lycra">Lycra</option>
                                        <option value="Dry-Fit Fabric">Dry-Fit Fabric</option>
                                        <option value="Mesh Fabric">Mesh Fabric</option>
                                        <option value="Compression Fabric">Compression Fabric</option>
                                    </optgroup>
                                    <optgroup label="Denim">
                                        <option value="Raw Denim">Raw Denim</option>
                                        <option value="Selvedge Denim">Selvedge Denim</option>
                                        <option value="Stretch Denim">Stretch Denim</option>
                                        <option value="Washed Denim">Washed Denim</option>
                                        <option value="Distressed Denim">Distressed Denim</option>
                                    </optgroup>
                                    <optgroup label="African Fabrics">
                                        <option value="Ankara">Ankara</option>
                                        <option value="Aso Oke">Aso Oke</option>
                                        <option value="Adire">Adire</option>
                                        <option value="Lace Fabric">Lace Fabric</option>
                                        <option value="George Fabric">George Fabric</option>
                                        <option value="Kente">Kente</option>
                                        <option value="Brocade">Brocade</option>
                                    </optgroup>
                                    <optgroup label="Premium & Signature">
                                        <option value="Double-Stitched Fabric">Double-Stitched Fabric</option>
                                        <option value="Premium Knit">Premium Knit</option>
                                        <option value="Luxury Blend">Luxury Blend</option>
                                        <option value="Breathable Fabric">Breathable Fabric</option>
                                        <option value="Sustainable Fabric">Sustainable Fabric</option>
                                        <option value="Signature Fabric">Signature Fabric</option>
                                        <option value="Soft-Touch Material">Soft-Touch Material</option>
                                    </optgroup>
                                </select>
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

                            <div className="mt-2">
                                <label className="font-['Inter'] text-sm font-medium text-gray-700 mb-2 block">
                                    Available Sizes
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                const currentSizes = formData.sizes || []
                                                const newSizes = currentSizes.includes(size)
                                                    ? currentSizes.filter(s => s !== size)
                                                    : [...currentSizes, size]
                                                setFormData({...formData, sizes: newSizes})
                                            }}
                                            className={`px-4 py-2 border rounded-lg text-sm font-['Inter'] transition-colors ${
                                                (formData.sizes || []).includes(size)
                                                    ? 'bg-black text-white border-black'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Image Section */}
                            <div className="mt-4">
                                <label className="font-['Inter'] text-sm font-medium text-gray-700 mb-2 block">
                                    Product Images (First image = main shop image)
                                </label>

                                <div className="grid grid-cols-5 gap-2">
                                    {[0, 1, 2, 3, 4].map((index) => (
                                        <div key={index} className="relative">

                                            {/* Image slot */}
                                            <div
                                                className={`relative aspect-square border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:border-black transition-colors ${
                                                    imagePreviewUrls[index] ? 'border-black' : 'border-gray-300'
                                                }`}
                                                onClick={() => document.getElementById(`image-input-${index}`).click()}
                                            >
                                                {imagePreviewUrls[index] ? (
                                                    <>
                                                        <img
                                                            src={imagePreviewUrls[index]}
                                                            alt={`Product image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Remove button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                const newUrls = [...imagePreviewUrls]
                                                                const newImages = [...productImages]
                                                                newUrls[index] = ''
                                                                newImages[index] = null
                                                                setImagePreviewUrls(newUrls)
                                                                setProductImages(newImages)
                                                            }}
                                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
                                                        >
                                                            ×
                                                        </button>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center h-full p-1">
                                                        <svg className="w-5 h-5 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        <span className="text-[9px] text-gray-400 text-center font-['Inter']">
                                                            {index === 0 ? 'Main Image' : `Image ${index + 1}`}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Label below each slot */}
                                            <p className="text-[9px] text-center mt-1 font-['Inter'] text-gray-500">
                                                {index === 0 ? (
                                                    <span className="text-black font-semibold">Main ★</span>
                                                ) : (
                                                    `View ${index + 1}`
                                                )}
                                            </p>

                                            {/* Hidden file input */}
                                            <input
                                                id={`image-input-${index}`}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files[0]
                                                    if (!file) return
                                                    const reader = new FileReader()
                                                    reader.onload = (ev) => {
                                                        const newUrls = [...imagePreviewUrls]
                                                        const newImages = [...productImages]
                                                        newUrls[index] = ev.target.result
                                                        newImages[index] = file
                                                        setImagePreviewUrls(newUrls)
                                                        setProductImages(newImages)
                                                    }
                                                    reader.readAsDataURL(file)
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <p className="text-[11px] text-gray-400 font-['Inter'] mt-2">
                                    * First image (Main ★) will be shown on the shop page. Other images show in the product detail page gallery below the main image.
                                </p>
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
