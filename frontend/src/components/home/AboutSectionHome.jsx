const AboutSectionHome = () => {
  return (
    <section className="bg-white text-[#111111] py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[#555555] mb-4 font-body">About URBAN DRIP</p>
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight font-display">
              WE ARE URBAN DRIP
            </h2>
            <p className="mt-6 text-[#555555] text-lg leading-relaxed max-w-3xl font-body">
              A high-fashion streetwear brand built for those who live loud and move in shadows. Our collections blend premium quality, cinematic design, and culture-driven energy.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="/shop" className="inline-flex items-center justify-center rounded-full bg-[#111111] px-10 py-4 text-sm font-black uppercase tracking-[0.35em] text-white transition hover:bg-[#333333] font-body">
                Shop the Edit
              </a>
              <a href="/category/hoodies-sweatshirts" className="inline-flex items-center justify-center rounded-full border border-[#eeeeee] px-10 py-4 text-sm font-bold uppercase tracking-[0.35em] text-[#555555] transition hover:border-[#111111] hover:text-[#111111] font-body">
                Discover Hoodies
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] h-[520px] bg-[#f9f9f9] shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <img
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&h=800&fit=crop"
              alt="Urban drip fashion editorial"
              loading="lazy"
              onError={(e) => e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=500&fit=crop'}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <div className="mt-16 rounded-[2rem] border border-[#eeeeee] bg-[#f9f9f9] p-10">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-5xl font-black text-[#111111]">50K+</div>
              <p className="mt-3 text-[#555555] uppercase tracking-[0.35em] text-sm font-body">Customers</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-[#111111]">500+</div>
              <p className="mt-3 text-[#555555] uppercase tracking-[0.35em] text-sm font-body">Products</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-[#111111]">100+</div>
              <p className="mt-3 text-[#555555] uppercase tracking-[0.35em] text-sm font-body">Countries</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSectionHome;
