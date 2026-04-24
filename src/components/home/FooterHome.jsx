import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const FooterHome = () => {
  return (
    <footer className="bg-[#0a0a0a] text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr] pb-12 border-b border-white/10">
          <div>
            <Link to="/" className="text-3xl font-black tracking-tighter uppercase">
              URBAN DRIP
            </Link>
            <p className="mt-5 text-[#888888] max-w-xs leading-relaxed text-sm">
              Streetwear with a premium edge. Bold silhouettes, cinematic details, and culture-first design.
            </p>
            <div className="mt-6 flex items-center gap-4 text-[#888888]">
              <Facebook size={20} className="hover:text-white transition" />
              <Instagram size={20} className="hover:text-white transition" />
              <Twitter size={20} className="hover:text-white transition" />
              <Mail size={20} className="hover:text-white transition" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.35em] text-[#888888] mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-[#888888]">
              <li>
                <Link to="/shop" className="hover:text-white transition">All Products</Link>
              </li>
              <li>
                <Link to="/category/t-shirts" className="hover:text-white transition">T-Shirts</Link>
              </li>
              <li>
                <Link to="/category/hoodies-sweatshirts" className="hover:text-white transition">Hoodies</Link>
              </li>
              <li>
                <Link to="/category/jackets" className="hover:text-white transition">Jackets</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.35em] text-[#888888] mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-[#888888]">
              <li>
                <Link to="/track" className="hover:text-white transition">Track Order</Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition">FAQ</a>
              </li>
              <li>
                <a href="mailto:support@urbandrip.com" className="hover:text-white transition">Contact</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">Shipping Info</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-[0.35em] text-[#888888] mb-6">Newsletter</h4>
            <p className="text-[#888888] text-sm leading-relaxed mb-6">
              Join the list for exclusive drops, restock alerts, and editorial news.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="w-full rounded-full border border-white/10 bg-[#111111] px-5 py-3 text-sm text-white placeholder-[#666666] focus:outline-none focus:border-[#e63946]"
              />
              <button className="rounded-full bg-[#e63946] px-6 py-3 text-sm font-black uppercase tracking-[0.35em] text-white transition hover:bg-[#c9a84c]">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-sm text-[#666666]">
          <p>© 2026 URBAN DRIP. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterHome;
