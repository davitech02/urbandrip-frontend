import { Truck, Award, Repeat, ShieldCheck } from 'lucide-react';

const values = [
  {
    icon: <Truck size={36} className="text-[#e63946]" />,
    title: 'Free Shipping',
    description: 'Fast, free shipping on orders over $100 across the U.S.'
  },
  {
    icon: <Award size={36} className="text-[#c9a84c]" />,
    title: 'Premium Quality',
    description: 'Every piece is crafted with premium fabrics and expert construction.'
  },
  {
    icon: <Repeat size={36} className="text-[#e63946]" />,
    title: 'Easy Returns',
    description: 'Hassle-free returns within 30 days for a confident checkout.'
  },
  {
    icon: <ShieldCheck size={36} className="text-[#c9a84c]" />,
    title: 'Authentic Streetwear',
    description: 'Curated drops rooted in culture, authenticity, and bold design.'
  }
];

const BrandValuesStrip = () => {
  return (
    <section className="bg-[#0a0a0a] text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div key={index} className="rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition hover:border-[#e63946]/50 hover:bg-white/10">
              <div className="mb-5">{value.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-[0.2em] mb-3">{value.title}</h3>
              <p className="text-[#888888] leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandValuesStrip;
