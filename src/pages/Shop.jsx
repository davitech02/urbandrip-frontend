import { useState, useEffect } from 'react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await API.get('/api/products');
                setProducts(res.data);
            } catch (err) {
                console.error("Error fetching products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="text-center py-20 font-bold">Loading the Drip...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-end mb-10">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter">THE COLLECTION</h1>
                    <p className="text-gray-500">Fresh drops, premium quality.</p>
                </div>
                <div className="flex space-x-4">
                    <select className="border-none bg-gray-100 rounded-lg p-2 text-sm focus:ring-0">
                        <option>All Categories</option>
                        <option>Men</option>
                        <option>Women</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default Shop;