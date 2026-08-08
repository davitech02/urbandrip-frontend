const Portfolio = () => {
  return (
    <section className="bg-white py-24 text-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tight font-display">Portfolio</h2>
          <p className="mt-4 text-[#555555] text-lg max-w-3xl mx-auto font-body">
            A lookbook of editorial frames showcasing the modern streetwear wardrobe.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="overflow-hidden rounded-3xl bg-[#f9f9f9]">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop"
              alt="Editorial street fashion outfit"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#f9f9f9]">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop"
              alt="Nigerian fashion editorial model"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#f9f9f9]">
            <img
              src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop"
              alt="Editorial streetwear portrait"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#f9f9f9]">
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop"
              alt="Fashion editorial outfit"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#f9f9f9]">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=500&fit=crop"
              alt="Nigerian streetwear ensemble"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#f9f9f9]">
            <img
              src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=500&fit=crop"
              alt="Street fashion editorial frame"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#f9f9f9]">
            <img
              src="https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop"
              alt="Modern fashion editorial portrait"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          <div className="overflow-hidden rounded-3xl bg-[#f9f9f9]">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=500&fit=crop"
              alt="Fashion lookbook image"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[280px] w-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
