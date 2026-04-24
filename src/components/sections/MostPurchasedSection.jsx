import { useState, useEffect } from 'react';
import API from '../../services/api';
import ProductCard from '../ProductCard';
import { ChevronRight } from 'lucide-react';

const MostPurchasedSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get('/products');
        // For now, we'll just show the first 4 products
        // In a real app, you'd fetch products sorted by purchase count
        setProducts(res.data.slice(0, 4));
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-20 font-bold">Loading...</div>;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-2 font-display">
              <span className="bg-gradient-to-r from-accent to-accent2 bg-clip-text text-transparent">Bestsellers</span>
            </h2>
            <p className="text-neutral-600 text-lg">
              Most loved by our community
            </p>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-primary font-bold uppercase tracking-widest hover:text-accent transition-colors duration-300 cursor-pointer group">
            <span>View All</span>
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MostPurchasedSection;
