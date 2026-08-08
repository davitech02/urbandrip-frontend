import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import { SortAsc, SortDesc } from 'lucide-react';

// Map URL slugs to backend category names
const categoryMap = {
  't-shirts': 'T-Shirts',
  'pants-shorts': 'Pants & Shorts',
  'hoodies': 'Hoodies',
  'polos': 'Polos',
  'shirts': 'Shirts',
  'jackets': 'Jackets',
  'ankara-native': 'Ankara/Native',
  'agbada': 'Agbada',
  'senator': 'Senator',
  'accessories': 'Accessories'
};

// Format category name for display
const formatCategoryName = (slug) => {
  return categoryMap[slug] || slug;
};

const getCategoryTitle = (slug) => {
  const titles = {
    't-shirts': 'T-Shirts',
    'pants-shorts': 'Pants & Shorts',
    'hoodies': 'Hoodies',
    'polos': 'Polos',
    'shirts': 'Shirts',
    'jackets': 'Jackets',
    'ankara-native': 'Ankara/Native',
    'agbada': 'Agbada',
    'senator': 'Senator',
    'accessories': 'Accessories'
  };
  return titles[slug] || 'Category';
};

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const categoryName = formatCategoryName(category);
        const res = await API.get(`/api/products?category=${categoryName}`);
        const items = res.data?.products || [];
        setProducts(items);
        setFilteredProducts(items);
        setError(null);
      } catch (err) {
        console.error("Error fetching category products", err);
        const message = err?.response?.data?.message || err?.message || 'Failed to load products';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [category]);

  // Sort products when sort options change
  useEffect(() => {
    const sorted = [...products].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(sorted);
  }, [products, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div className="text-lg font-bold text-gray-700">Loading the Drip...</div>
          <div className="text-sm text-gray-500 mt-2">Finding the best {getCategoryTitle(category).toLowerCase()} for you</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
            {getCategoryTitle(category)}
          </h1>
          <p className="text-gray-300 text-lg">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} in collection
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
            >
              {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              {sortOrder === 'asc' ? 'Low to High' : 'High to Low'}
            </button>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 font-semibold">
              No products found in this category yet.
            </p>
            <p className="text-gray-500 mt-2">
              Check back soon for new releases!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
