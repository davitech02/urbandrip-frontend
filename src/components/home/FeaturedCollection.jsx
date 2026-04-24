import { Link } from 'react-router-dom';

const categories = [
  { name: 'T-Shirts', slug: 't-shirts', count: 24, image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=500&fit=crop' },
  { name: 'Hoodies', slug: 'hoodies-sweatshirts', count: 18, image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=500&fit=crop' },
  { name: 'Pants', slug: 'pants-shorts', count: 16, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop' },
  { name: 'Polos', slug: 'polos', count: 12, image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop' },
  { name: 'Shirts', slug: 'shirts', count: 20, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop' },
  { name: 'Jackets', slug: 'jackets', count: 14, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop' }
];

const FeaturedCollection = () => {
  return (
    <section className="bg-[#0a0a0a] text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.35em] text-[#888888] mb-4">Featured Collection</p>
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter">THE COLLECTION</h2>
          <p className="mt-4 text-[#888888] max-w-3xl mx-auto text-lg">
            A curated edit of bold silhouettes, premium fabrics, and iconic streetwear attitude.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111111] aspect-[3/4] shadow-[0_25px_60px_rgba(0,0,0,0.35)]"
            >
              <img
                src={category.image}
                alt={category.name}
                loading="lazy"
                onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="text-[#888888] uppercase tracking-[0.3em] text-xs mb-2">{category.count} items</div>
                <h3 className="text-3xl font-black uppercase tracking-tight text-white mb-4">{category.name}</h3>
                <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold uppercase tracking-[0.35em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Explore
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
