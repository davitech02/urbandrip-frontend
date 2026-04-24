import { Heart } from 'lucide-react';

const products = [
  { id: 1, name: 'Denim Bomber Jacket', price: '$320', image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop' },
  { id: 2, name: 'Oversized Hoodie', price: '$220', image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=500&fit=crop' },
  { id: 3, name: 'Cargo Pants', price: '$104', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop' },
  { id: 4, name: 'Graphic Tee', price: '$78', image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop' },
  { id: 5, name: 'Polo Shirt', price: '$58', image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop' },
  { id: 6, name: 'Agbada Set', price: '$240', image: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&h=500&fit=crop' },
  { id: 7, name: 'Native Senator', price: '$320', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop' },
  { id: 8, name: 'Ankara Jacket', price: '$360', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop' }
];

const FeaturedProducts = () => {
  return (
    <section className="bg-[#f9f9f9] text-[#111111] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.35em] text-[#555555] mb-4 font-body">Top sale of the week</p>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight font-display">Featured Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative overflow-hidden rounded-[1.75rem] border border-[#eeeeee] bg-white shadow-sm transition hover:shadow-xl">
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
                  className="w-full h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 rounded-full bg-[#e63946] px-3 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-white">SALE</div>
                <button className="absolute top-4 right-4 rounded-full bg-white/90 p-2 text-[#111111] shadow-sm transition hover:scale-110">
                  <Heart size={18} />
                </button>
              </div>
              <div className="px-5 py-6">
                <h3 className="text-xl font-semibold tracking-tight text-[#111111] font-body">{product.name}</h3>
                <p className="mt-3 text-lg font-bold text-[#111111] font-body">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
