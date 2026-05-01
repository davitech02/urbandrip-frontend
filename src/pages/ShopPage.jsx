import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import productsData from '../data/shopProducts';

const categories = ['All', 'T-Shirts', 'Polos', 'Hoodies', 'Pants & Shorts', 'Shirts', 'Jackets', 'Ankara/Native'];
const priceRanges = [
  { label: 'Under ₦5,000', value: 'under-5000' },
  { label: '₦5,000–₦15,000', value: '5000-15000' },
  { label: '₦15,000–₦30,000', value: '15000-30000' },
  { label: 'Above ₦30,000', value: 'above-30000' }
];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price Low–High', value: 'low-high' },
  { label: 'Price High–Low', value: 'high-low' },
  { label: 'Best Selling', value: 'best-selling' }
];

const ShopPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('');
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSort, setSelectedSort] = useState('newest');
  const [openSections, setOpenSections] = useState({ categories: true, price: false, size: false, sort: false });
  const [wishlist, setWishlist] = useState({});
  const [products, setProducts] = useState(productsData);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { addToCart } = useCart();

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          // Transform API products to match the format expected by the component
          const transformedProducts = data.products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            category: p.category,
            image: p.images && p.images.length > 0 ? p.images[0] : '',
            description: p.description,
            badge: p.badge,
            sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            stock_quantity: p.stock_quantity
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Failed to load products from API, using fallback:', error);
        setProducts(productsData);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategory !== 'All') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    if (selectedPrice) {
      filtered = filtered.filter((product) => {
        if (selectedPrice === 'under-5000') return product.price < 5000;
        if (selectedPrice === '5000-15000') return product.price >= 5000 && product.price <= 15000;
        if (selectedPrice === '15000-30000') return product.price > 15000 && product.price <= 30000;
        if (selectedPrice === 'above-30000') return product.price > 30000;
        return true;
      });
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(() => true);
    }

    if (selectedSort === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'newest') {
      filtered = filtered.slice().reverse();
    }

    return filtered;
  }, [selectedCategory, selectedPrice, selectedSizes, selectedSort]);

  const toggleWishlist = (id) => {
    setWishlist((current) => ({ ...current, [id]: !current[id] }));
  };

  const toggleSection = (section) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  const clearFilters = () => {
    setSelectedCategory('All');
    setSelectedPrice('');
    setSelectedSizes([]);
    setSelectedSort('newest');
  };

  const toggleSize = (size) => {
    setSelectedSizes((current) =>
      current.includes(size) ? current.filter((item) => item !== size) : [...current, size]
    );
  };

  return (
    <div className="bg-[#f9f9f9] min-h-screen">
      <div className="relative w-full h-[400px] overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/assets/videos/shop.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="font-['Playfair_Display'] text-6xl font-bold tracking-wide mb-4">
            SHOP ALL
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-300">
            Home &nbsp;•&nbsp; Shop
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-6 rounded-[2rem] border border-[#eeeeee] bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.35em] text-[#111111] font-display">FILTER BY</h2>
          </div>

          <div className="space-y-4">
            <div className="border border-[#eeeeee] rounded-3xl overflow-hidden">
              <button onClick={() => toggleSection('categories')} className="w-full flex items-center justify-between px-5 py-4 text-left font-bold uppercase tracking-[0.25em] text-[#111111]">
                Categories
                {openSections.categories ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              {openSections.categories && (
                <div className="space-y-2 px-5 pb-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left text-sm ${selectedCategory === category ? 'text-black font-semibold' : 'text-[#555555]'} hover:text-black transition`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-[#eeeeee] rounded-3xl overflow-hidden">
              <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between px-5 py-4 text-left font-bold uppercase tracking-[0.25em] text-[#111111]">
                Price Range
                {openSections.price ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              {openSections.price && (
                <div className="space-y-2 px-5 pb-4">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setSelectedPrice(range.value)}
                      className={`w-full text-left text-sm ${selectedPrice === range.value ? 'text-black font-semibold' : 'text-[#555555]'} hover:text-black transition`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-[#eeeeee] rounded-3xl overflow-hidden">
              <button onClick={() => toggleSection('size')} className="w-full flex items-center justify-between px-5 py-4 text-left font-bold uppercase tracking-[0.25em] text-[#111111]">
                Size
                {openSections.size ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              {openSections.size && (
                <div className="flex flex-wrap gap-2 px-5 pb-4">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.25em] transition ${selectedSizes.includes(size) ? 'border-black bg-black text-white' : 'border-[#dddddd] bg-white text-[#555555] hover:border-black'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-[#eeeeee] rounded-3xl overflow-hidden">
              <button onClick={() => toggleSection('sort')} className="w-full flex items-center justify-between px-5 py-4 text-left font-bold uppercase tracking-[0.25em] text-[#111111]">
                Sort By
                {openSections.sort ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
              </button>
              {openSections.sort && (
                <div className="space-y-2 px-5 pb-4">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedSort(option.value)}
                      className={`w-full text-left text-sm ${selectedSort === option.value ? 'text-black font-semibold' : 'text-[#555555]'} hover:text-black transition`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <button onClick={clearFilters} className="w-full rounded-full bg-black px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-[#333333]">
            Clear Filters
          </button>
        </aside>

        <main>
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-sm uppercase tracking-[0.35em] text-[#555555] font-body">Showing {filteredProducts.length} products</p>
            <div className="flex items-center gap-3">
              <label htmlFor="sort" className="text-sm uppercase tracking-[0.35em] text-[#555555] font-body">Sort by</label>
              <select
                id="sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="rounded-full border border-[#dddddd] bg-white px-4 py-3 text-sm text-[#111111] font-body focus:outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group relative overflow-hidden bg-white border border-gray-100 rounded-md hover:shadow-md transition-shadow duration-300">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop'}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className={`absolute top-4 left-4 rounded-full px-2 py-0.5 text-[9px] font-['Inter'] uppercase tracking-widest text-white ${product.badge === 'SALE' ? 'bg-red-500' : 'bg-black'}`}>
                      {product.badge}
                    </div>
                  </div>
                </Link>
                <div className="p-3">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-['Inter'] font-normal mb-1">{product.category}</p>
                  <Link to={`/product/${product.id}`} className="block">
                    <h3 className="font-['Playfair_Display'] text-[15px] font-semibold text-gray-900 leading-snug mb-1">{product.name}</h3>
                  </Link>
                  <div className="flex items-center gap-3">
                    <p className="font-['Inter'] text-[14px] font-medium text-gray-900">₦{product.price.toLocaleString()}</p>
                    {product.originalPrice && (
                      <p className="text-[12px] text-gray-400 line-through ml-2">₦{product.originalPrice.toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-4 right-4 rounded-full border border-white/70 bg-white/90 p-2 text-[#111111] shadow-lg transition hover:scale-110"
                >
                  <Heart size={18} className={wishlist[product.id] ? 'fill-[#e63946]' : ''} />
                </button>
                <div className="absolute bottom-5 left-1/2 w-[90%] -translate-x-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product, "M", 1);
                    }}
                    className="w-full rounded-full bg-black px-5 py-3 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-[#333333]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
