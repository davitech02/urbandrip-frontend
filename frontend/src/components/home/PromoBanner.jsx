const PromoBanner = () => {
  return (
    <section className="bg-[#f0f0f0] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#555555] mb-4 font-body">Limited Time</p>
            <h2 className="text-6xl md:text-7xl font-black uppercase tracking-tight text-[#111111] font-display">30% OFF</h2>
            <p className="mt-6 max-w-xl text-[#555555] text-lg leading-relaxed font-body">
              Fashionable streetwear for the modern culture, designed to stand out and elevate every look.
            </p>
            <a
              href="/shop"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-[#111111] px-10 py-4 text-sm font-black uppercase tracking-[0.35em] text-white transition hover:bg-[#333333] font-body"
            >
              SHOP NOW
            </a>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=700&fit=crop"
              alt="Model wearing streetwear fashion"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-[500px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
