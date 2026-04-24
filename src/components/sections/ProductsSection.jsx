import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProductsSection = () => {
  const categories = [
    {
      name: 'T-Shirts',
      slug: 't-shirts',
      images: [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=400&fit=crop'
      ],
      description: 'Classic and comfortable tees'
    },
    {
      name: 'Pants & Shorts',
      slug: 'pants-shorts',
      images: [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=400&fit=crop'
      ],
      description: 'Premium bottoms collection'
    },
    {
      name: 'Hoodies & Sweatshirts',
      slug: 'hoodies-sweatshirts',
      images: [
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=400&fit=crop'
      ],
      description: 'Cozy layering pieces'
    },
    {
      name: 'Polos',
      slug: 'polos',
      images: [
        'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=400&fit=crop'
      ],
      description: 'Sophisticated and versatile'
    },
    {
      name: 'Shirts',
      slug: 'shirts',
      images: [
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=600&h=400&fit=crop'
      ],
      description: 'Dress it up or down'
    },
    {
      name: 'Jackets',
      slug: 'jackets',
      images: [
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=400&fit=crop'
      ],
      description: 'Statement outerwear'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 font-display text-black">
            Our Collections
          </h2>
          <p className="text-black text-lg max-w-2xl mx-auto leading-relaxed">
            Curated categories featuring the latest in streetwear fashion. Find your style, express yourself.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-gray-100"
            >
              {/* Main Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.images[0]}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Additional Images Overlay */}
                <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {category.images.slice(1, 3).map((img, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 bg-gradient-to-br from-white to-gray-50">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-accent transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm font-medium leading-relaxed">
                  {category.description}
                </p>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-primary font-bold text-sm uppercase tracking-widest group-hover:text-accent transition-colors duration-300">
                    <span>Explore Collection</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {category.images.length} styles
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Products CTA */}
        <div className="text-center">
          <Link
            to="/shop"
            className="inline-block bg-black text-white px-12 py-4 rounded-none font-bold uppercase tracking-widest hover:bg-accent transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
