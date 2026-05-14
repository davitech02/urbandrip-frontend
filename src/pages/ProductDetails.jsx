import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            const res = await API.get(`/api/products/${id}`);
            setProduct(res.data);
        };
        fetchProduct();
    }, [id]);

    if (!product) return <div className="text-center py-20">Loading details...</div>;

    const imageUrl = (Array.isArray(product.images) ? product.images[0] : product.images?.[0]) || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop';
    const availableSizes = Array.isArray(product.sizes)
        ? product.sizes
        : typeof product.sizes === 'string'
            ? product.sizes.split(',').map((size) => size.trim()).filter(Boolean)
            : [];

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size");
            return;
        }
        addToCart(product, selectedSize);
        toast.success("Added to bag!");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <img src={imageUrl} alt={product.name} className="w-full rounded-2xl shadow-lg" />
            </div>
            <div className="flex flex-col justify-center">
                <span className="text-accent font-bold tracking-widest uppercase text-sm">{product.category}</span>
                <h1 className="text-5xl font-black mt-2 mb-4">{product.name}</h1>
                <p className="text-3xl font-light mb-6">${product.price}</p>
                <p className="text-gray-600 mb-8 text-lg leading-relaxed">{product.description}</p>
                
                <div className="mb-8">
                  <h3 className="font-bold mb-3 uppercase tracking-tight">Select Size</h3>
                  <div className="flex gap-3 flex-wrap">
                      {availableSizes.length > 0 ? availableSizes.map(size => (
                          <button 
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`w-12 h-12 border-2 font-bold transition-all ${selectedSize === size ? 'border-black bg-black text-white' : 'border-gray-200 hover:border-black'}`}
                          >
                              {size}
                          </button>
                      )) : (
                          <p className="text-gray-400 italic">No sizes available for this item.</p>
                      )}
                  </div>
                </div>
                
                <button 
                    onClick={handleAddToCart}
                    className="bg-black text-white py-5 rounded-full font-bold text-xl hover:bg-accent transition-all shadow-xl active:scale-95"
                >
                    ADD TO BAG
                </button>
            </div>
        </div>
    );
};

export default ProductDetails;