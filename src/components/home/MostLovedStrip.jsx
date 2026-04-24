import { ArrowRight } from 'lucide-react';

const products = [
  { id: 1, name: 'Midnight Oversized Tee', price: '$68', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Shadow Zip Hoodie', price: '$128', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Graphite Cargo Pant', price: '$104', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80' },
  { id: 4, name: 'Black Label Polo', price: '$58', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
  { id: 5, name: 'Asphalt Bomber', price: '$198', image: 'https://images.unsplash.com/photo-1521334884684-d80222895322?auto=format&fit=crop&w=800&q=80' }
];

const MostLovedStrip = () => {
  return (
    <section className="bg-[#0a0a0a] text-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-10">
          <div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">MOST LOVED</h2>
            <p className="text-[#888888] mt-2">A dark edit of our top streetwear essentials.</p>
          </div>
          <a href="/shop" className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.35em] font-bold text-white hover:text-[#e63946] transition">
            VIEW ALL <ArrowRight size={18} />
          </a>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 pb-4 scroll-smooth">
          <div className="flex gap-6 min-w-[1200px]">
            {products.map((product) => (
              <div key={product.id} className="group relative min-w-[300px] rounded-[2rem] border border-white/10 bg-[#121212] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <div className="relative overflow-hidden rounded-[1.75rem]">
                  <img src={product.image} alt={product.name} className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </div>
                <div className="mt-5">
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">{product.name}</h3>
                  <p className="mt-3 text-[#888888] text-sm">{product.price}</p>
                </div>
                <button className="absolute right-4 bottom-4 rounded-full bg-[#e63946] px-5 py-3 text-sm font-bold uppercase tracking-[0.35em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  QUICK ADD
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MostLovedStrip;
