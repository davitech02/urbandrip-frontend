const EditorialBanner = () => {
  return (
    <section className="relative bg-black text-white">
      <div
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1520975913660-b7be5ee8c93d?auto=format&fit=crop&w=1600&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 mx-auto max-w-6xl px-6 py-28 sm:py-32 lg:py-36">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.35em] text-[#888888] mb-6">
              Editorial Capsule
            </p>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none">
              DRIP DIFFERENT
            </h2>
            <p className="mt-6 text-[#d1d1d1] text-lg max-w-2xl leading-relaxed">
              A cinematic statement piece for the boldest streetwear wardrobe. Crafted to stand out and built to last.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-4">
              <a href="/shop" className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-sm font-black uppercase tracking-[0.35em] text-black transition hover:bg-[#e63946] hover:text-white">
                Explore the Drop
              </a>
              <a href="/category/jackets" className="inline-flex items-center justify-center rounded-full border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-[0.35em] text-[#888888] transition hover:border-[#e63946] hover:text-white">
                See Jackets
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorialBanner;
