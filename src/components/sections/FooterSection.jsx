import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail } from 'lucide-react';

const FooterSection = () => {
  return (
    <footer className="bg-neutral-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="text-2xl font-black tracking-tighter mb-4 inline-block">
              URBAN<span className="text-accent">DRIP</span>
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Premium streetwear for culture enthusiasts. Express yourself with every piece.
            </p>
            <div className="flex space-x-4 mt-6">
              <button className="text-neutral-400 hover:text-accent transition-colors duration-300">
                <Facebook size={20} />
              </button>
              <button className="text-neutral-400 hover:text-accent transition-colors duration-300">
                <Instagram size={20} />
              </button>
              <button className="text-neutral-400 hover:text-accent transition-colors duration-300">
                <Twitter size={20} />
              </button>
              <button className="text-neutral-400 hover:text-accent transition-colors duration-300">
                <Mail size={20} />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-accent">Shop</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/category/t-shirts" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link to="/category/hoodies-sweatshirts" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link to="/category/jackets" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                  Jackets
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-accent">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/track" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                  FAQ
                </a>
              </li>
              <li>
                <a href="mailto:support@urbandrip.com" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-neutral-400 hover:text-white transition-colors duration-300 text-sm">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-accent">Newsletter</h4>
            <p className="text-neutral-400 text-sm mb-4">
              Subscribe for exclusive drops and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-neutral-800 border border-neutral-700 px-4 py-2 text-sm placeholder-neutral-500 focus:outline-none focus:border-accent text-white"
              />
              <button className="bg-accent text-white px-4 py-2 font-bold hover:bg-accent/80 transition-colors duration-300">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800"></div>

        {/* Bottom Section */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-500 text-sm">
            © 2026 UrbanDrip. All rights reserved.
          </p>
          <div className="flex space-x-8 mt-6 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
