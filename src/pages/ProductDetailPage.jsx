import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star, Minus, Plus, Share2, Heart, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const details = [
  {
    title: 'Materials',
    content: '100% premium cotton blend with artisan finishes for a clean, elevated feel.'
  },
  {
    title: 'Care Instructions',
    content: 'Machine wash cold with similar colors. Lay flat to dry and iron on low heat.'
  },
  {
    title: 'Shipping Info',
    content: 'Fast, tracked shipping across Nigeria with next-day options available in select cities.'
  },
  {
    title: 'Returns Policy',
    content: 'Easy returns within 30 days. Products must be unworn and returned in original packaging.'
  }
];

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [openDetail, setOpenDetail] = useState('Materials');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);

        // Fetch all products for related products
        const allResponse = await fetch(`${API_URL}/api/products`);
        if (allResponse.ok) {
          const allData = await allResponse.json();
          setRelatedProducts((allData.products || []).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  // Handle product images
  useEffect(() => {
    if (product?.images) {
      const imgs = typeof product.images === 'string'
        ? JSON.parse(product.images)
        : product.images
      if (imgs && imgs.length > 0) {
        setMainImage(imgs[0])
        setThumbnails(imgs)
      }
    } else if (product?.image) {
      setMainImage(product.image)
      setThumbnails([product.image, product.image, product.image, product.image])
    }
  }, [product])

  if (loading) {
    return <div className="text-center py-20"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div><p className="mt-4">Loading product...</p></div>;
  }

  if (!product) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  return (
    <div className="bg-[#f9f9f9] min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-start">
          <div>
            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <img
                src={mainImage}
                alt={product.name}
                loading="lazy"
                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
                className="h-[520px] w-full object-cover rounded-[1.75rem]"
              />
              <div className="mt-6 grid grid-cols-4 gap-4">
                {thumbnails.map((thumb, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(thumb)}
                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                      mainImage === thumb ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`View ${index + 1}`}
                      loading="lazy"
                      onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-[#555555] font-body">{product.category}</p>
              <h1 className="mt-4 text-5xl font-black uppercase tracking-tight font-display text-[#111111]">{product.name}</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#555555] font-body">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-[#e63946]" />
                  <Star size={16} className="text-[#e63946]" />
                  <Star size={16} className="text-[#e63946]" />
                  <Star size={16} className="text-[#e63946]" />
                  <Star size={16} className="text-[#e63946]" />
                </div>
                <span>(24 reviews)</span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                <p className="text-4xl font-black text-[#111111] font-body">₦{product.price.toLocaleString()}</p>
                {product.originalPrice && (
                  <p className="text-sm text-[#888888] line-through font-body">₦{product.originalPrice.toLocaleString()}</p>
                )}
              </div>
              <p className="mt-6 text-[#555555] leading-relaxed font-body">
                A premium statement piece designed for modern streetwear style. Tailored with fashion-forward details and bold silhouette.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-sm uppercase tracking-[0.35em] text-[#555555] font-body mb-4">Size</h3>
                  <div className="flex flex-wrap gap-3">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-[48px] rounded-full border px-4 py-3 text-sm uppercase tracking-[0.35em] transition ${selectedSize === size ? 'border-black bg-black text-white' : 'border-[#dddddd] bg-white text-[#111111] hover:border-black'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm uppercase tracking-[0.35em] text-[#555555] font-body mb-4">Quantity</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity((qty) => Math.max(1, qty - 1))}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dddddd] bg-white text-[#111111]"
                    >
                      <Minus size={18} />
                    </button>
                    <div className="min-w-[56px] text-center text-lg font-black">{quantity}</div>
                    <button
                      onClick={() => setQuantity((qty) => qty + 1)}
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#dddddd] bg-white text-[#111111]"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <button 
                    onClick={() => addToCart(product, selectedSize, quantity)}
                    className="w-full rounded-full bg-[#111111] px-6 py-4 text-sm font-black uppercase tracking-[0.35em] text-white transition hover:bg-[#333333]"
                  >
                    Add to Cart
                  </button>
                  <button className="w-full rounded-full border border-[#111111] bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.35em] text-[#111111] transition hover:bg-[#f5f5f5]">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-6 shadow-sm">
              <div className="space-y-3">
                {details.map((item) => (
                  <div key={item.title} className="border-t border-[#eeeeee] pt-4">
                    <button
                      onClick={() => setOpenDetail(item.title)}
                      className="flex w-full items-center justify-between text-left text-sm font-black uppercase tracking-[0.35em] text-[#111111]"
                    >
                      {item.title}
                      <ChevronDown size={18} className={`${openDetail === item.title ? 'rotate-180' : ''} transition-transform duration-300`} />
                    </button>
                    {openDetail === item.title && (
                      <p className="mt-4 text-[#555555] leading-relaxed font-body">{item.content}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-4 text-[#555555] font-body">
                <span className="uppercase tracking-[0.35em]">Share</span>
                <div className="flex items-center gap-3">
                  <Share2 size={18} className="cursor-pointer transition hover:text-[#111111]" />
                  <Heart size={18} className="cursor-pointer transition hover:text-[#e63946]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-[2rem] bg-white p-8 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black uppercase tracking-tight font-display">You may also like</h2>
            <Link to="/shop" className="text-sm uppercase tracking-[0.35em] text-[#555555] font-body">View All</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="group overflow-hidden rounded-[1.75rem] border border-[#eeeeee] bg-[#f9f9f9] transition hover:shadow-xl">
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
                    className="h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className={`absolute top-4 left-4 rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-white ${item.badge === 'SALE' ? 'bg-[#e63946]' : 'bg-[#111111]'}`}>
                    {item.badge}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#888888] font-body">{item.category}</p>
                  <h3 className="mt-2 text-lg font-black text-[#111111] font-display">{item.name}</h3>
                  <p className="mt-3 text-lg font-black text-[#111111] font-body">₦{item.price.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
