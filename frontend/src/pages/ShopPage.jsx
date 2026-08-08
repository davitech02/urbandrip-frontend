import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 16;
  const { addToCart } = useCart();

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          const transformedProducts = data.products.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            original_price: p.original_price,
            category: p.category,
            image_url: p.images && p.images.length > 0 ? p.images[0] : '',
            images: p.images,
            description: p.description,
            badge: p.badge,
            sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            stock_quantity: p.stock_quantity
          }));
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Failed to load products from API:', error);
        setFetchError(error.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

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
      filtered = filtered.filter((product) => {
        const productSizes = Array.isArray(product.sizes) ? product.sizes : [];
        return productSizes.some((s) => selectedSizes.includes(s));
      });
    }

    if (selectedSort === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (selectedSort === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (selectedSort === 'newest') {
      filtered = filtered.slice().reverse();
    }

    return filtered;
  }, [selectedCategory, selectedPrice, selectedSizes, selectedSort, products]);

  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, page, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedPrice, selectedSizes, selectedSort]);

  const toggleWishlist = (id) => {
    setWishlist((current) => ({ ...current, [id]: !current[id] }));
  };

  const getProductImage = (product) => {
    if (product.image_url) return product.image_url;
    if (Array.isArray(product.images) && product.images.length > 0) return product.images[0];
    return product.image || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop'
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
      <div className="relative w-full h-[250px] sm:h-[300px] md:h-[400px] overflow-hidden">
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
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-6xl font-bold tracking-wide mb-2 sm:mb-3 md:mb-4">
            SHOP ALL
          </h1>
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-gray-300">
            Home &nbsp;•&nbsp; Shop
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-black mb-4"></div>
            <p className="text-gray-500 font-['Inter'] text-sm">Loading products...</p>
          </div>
        </div>
      )}

      {fetchError && !loading && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 font-['Inter'] text-sm">
            Could not load latest products. Showing cached products.
          </div>
        </div>
      )}

      {!loading && (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 grid gap-4 sm:gap-6 md:gap-10 md:grid-cols-[1fr] lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Mobile Filter Button */}
        <div className="flex items-center justify-between mb-3 md:hidden">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex items-center gap-2 border border-gray-300 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-['Inter'] h-10 sm:h-11 min-w-[44px]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filter
          </button>
          <span className="text-xs text-gray-500 font-['Inter']">
            {filteredProducts.length} items
          </span>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileFilterOpen(false)}
            />
            <div className="fixed left-0 top-0 h-full w-72 bg-white z-50 md:hidden overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-['Playfair_Display'] font-bold text-lg">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Filter Content for Mobile */}
              <div className="p-4 space-y-4">
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
                          onClick={() => {
                            setSelectedCategory(category);
                            setMobileFilterOpen(false);
                          }}
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
                          onClick={() => {
                            setSelectedPrice(range.value);
                            setMobileFilterOpen(false);
                          }}
                          className={`w-full text-left text-sm ${selectedPrice === range.value ? 'text-black font-semibold' : 'text-[#555555]'} hover:text-black transition`}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => {
                  clearFilters();
                  setMobileFilterOpen(false);
                }} className="w-full rounded-full bg-black px-5 py-4 text-sm font-black uppercase tracking-[0.25em] text-white transition hover:bg-[#333333]">
                  Clear Filters
                </button>
              </div>
            </div>
          </>
        )}

        {/* Desktop Sidebar */}
        <aside className="hidden md:block space-y-6 rounded-[2rem] border border-[#eeeeee] bg-white p-6 shadow-sm lg:sticky lg:top-24">
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
          <div className="mb-8 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-[#555555] font-body">Showing {filteredProducts.length} products</p>
            <div className="flex items-center gap-2 sm:gap-3">
              <label htmlFor="sort" className="hidden sm:block text-xs sm:text-sm uppercase tracking-[0.35em] text-[#555555] font-body">Sort by</label>
              <select
                id="sort"
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="rounded-full border border-[#dddddd] bg-white px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#111111] font-body focus:outline-none min-h-[44px]"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm relative flex flex-col h-full">
                {/* Image Container */}
                <Link to={`/product/${product.id}`} className="block relative w-full aspect-square overflow-hidden bg-gray-50 group">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    loading="lazy"
                    width="400"
                    height="400"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Badge - Top Left */}
                  <div className={`absolute top-2 sm:top-3 left-2 sm:left-3 rounded-full px-2 py-0.5 text-[8px] sm:text-[9px] font-['Inter'] uppercase tracking-widest text-white font-semibold ${product.badge === 'SALE' ? 'bg-red-500' : 'bg-black'}`}>
                    {product.badge}
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-gray-400 font-['Inter'] font-normal mb-0.5 sm:mb-1">{product.category}</p>
                    <Link to={`/product/${product.id}`} className="block mb-1 sm:mb-2">
                      <h3 className="font-['Playfair_Display'] text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-3">
                    <p className="font-['Inter'] text-[11px] sm:text-[12px] md:text-[13px] font-semibold text-gray-900">₦{product.price.toLocaleString()}</p>
                    {product.original_price && (
                      <p className="text-[9px] sm:text-[10px] text-gray-400 line-through">₦{product.original_price.toLocaleString()}</p>
                    )}
                  </div>
                </div>

                {/* Wishlist Button - Top Right */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 rounded-full border border-white/70 bg-white/95 p-1.5 sm:p-2 text-[#111111] shadow-lg transition hover:scale-110 min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center"
                >
                  <Heart size={14} className={`sm:w-[18px] sm:h-[18px] ${wishlist[product.id] ? 'fill-[#e63946]' : ''}`} />
                </button>

                {/* Add to Cart Circle Button - Bottom Right - Always Visible */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const defaultSize = product.sizes?.length > 0 ? product.sizes[0] : 'M';
                    addToCart(product, defaultSize, 1);
                  }}
                  className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 rounded-full bg-black text-white p-2 sm:p-2.5 shadow-lg transition hover:bg-[#333333] hover:scale-110 min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex items-center justify-center"
                  title="Add to Cart"
                >
                  <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm font-['Inter'] disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition-colors"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-full text-sm font-['Inter'] font-medium transition-colors ${
                    p === page
                      ? 'bg-black text-white'
                      : 'border border-gray-300 hover:border-black'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-full border border-gray-300 text-sm font-['Inter'] disabled:opacity-40 disabled:cursor-not-allowed hover:border-black transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
      )}
    </div>
  );
};

export default ShopPage;
