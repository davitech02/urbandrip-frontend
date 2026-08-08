const MarqueeStrip = () => {
  const items = ['NEW DROP', 'URBAN DRIP', 'PREMIUM STREETWEAR', 'FREE SHIPPING OVER $100'];

  return (
    <section className="bg-[#0a0a0a] border-y border-white/10 overflow-hidden">
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />

        <div className="flex items-center whitespace-nowrap py-4">
          <div className="animate-marquee flex items-center gap-12 text-white uppercase font-black tracking-[0.35em] text-sm">
            {[...items, ...items].map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-3">
                <span>{item}</span>
                <span className="text-[#e63946]">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarqueeStrip;
