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
    <section className="bg-[#f9f9f9] text-[#111111] py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
          <p className="text-[9px] sm:text-[10px] md:text-sm uppercase tracking-[0.35em] text-[#555555] mb-2 sm:mb-3 md:mb-4 font-body">Top sale of the week</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight font-display">Featured Products</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {products.map((product) => (
            <div key={product.id} className="group relative overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-[1.75rem] border border-[#eeeeee] bg-white shadow-sm transition hover:shadow-xl flex flex-col">
              <div className="relative overflow-hidden aspect-square sm:aspect-[3/4] bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 rounded-full bg-[#e63946] px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 text-[7px] sm:text-[8px] md:text-[10px] font-black uppercase tracking-[0.25em] sm:tracking-[0.35em] text-white">SALE</div>
                <button className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 rounded-full bg-white/90 p-1.5 sm:p-2 md:p-2.5 text-[#111111] shadow-sm transition hover:scale-110 min-h-[32px] min-w-[32px] sm:min-h-[36px] sm:min-w-[36px] md:min-h-[40px] md:min-w-[40px] flex items-center justify-center">
                  <Heart size={14} className="sm:w-[16px] sm:h-[16px] md:w-[18px] md:h-[18px]" />
                </button>
              </div>
              <div className="px-2 sm:px-3 md:px-4 lg:px-5 py-2 sm:py-3 md:py-4 lg:py-6 flex-1 flex flex-col justify-between">
                <h3 className="text-[11px] sm:text-[12px] md:text-[14px] lg:text-xl font-semibold tracking-tight text-[#111111] font-body line-clamp-2">{product.name}</h3>
                <p className="mt-1 sm:mt-2 md:mt-3 text-[11px] sm:text-[12px] md:text-[14px] lg:text-lg font-bold text-[#111111] font-body">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
