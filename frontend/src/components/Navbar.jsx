import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, User, Menu, ChevronDown, UserCircle, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, token, logout } = useAuth();
    const { cartCount } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user || !token) { return; }
        const fetchUnread = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setUnreadCount(data.unread_count || 0);
                }
            } catch { /* silent */ }
        };
        fetchUnread();
        const interval = setInterval(fetchUnread, 60000);
        return () => clearInterval(interval);
    }, [user, token]);

    const categories = [
        { name: 'T-Shirts', slug: 't-shirts' },
        { name: 'Pants & Shorts', slug: 'pants-shorts' },
        { name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
        { name: 'Polos', slug: 'polos' },
        { name: 'Shirts', slug: 'shirts' },
        { name: 'Jackets', slug: 'jackets' },
    ];

    return (
        <nav className="bg-white/95 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-black tracking-tighter text-black hover:text-gray-700 transition-colors duration-300">
                        URBAN<span className="text-black">DRIP</span>
                    </Link>

                    {/* Links */}
                    <div className="hidden md:flex space-x-8 font-medium text-sm uppercase tracking-widest">
                        <Link to="/" className="text-gray-700 hover:text-black transition-colors duration-300">Home</Link>
                        <Link to="/shop" className="text-gray-700 hover:text-black transition-colors duration-300">Shop</Link>
                        
                        {/* Categories Dropdown */}
                        <div className="relative group">
                            <button className="flex items-center space-x-1 text-gray-700 hover:text-black transition-colors duration-300">
                                <span>Categories</span>
                                <ChevronDown size={16} />
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        to={`/category/${cat.slug}`}
                                        className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-all duration-200 first:rounded-t-xl last:rounded-b-xl"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <Link to="/track-order" className="text-gray-700 hover:text-black transition-colors duration-300">Track Order</Link>
                    </div>

                    {/* Icons/Auth */}
                    <div className="flex items-center space-x-5">
                        {user && (
                            <Link to="/dashboard" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300" title="Notifications">
                                <Bell size={22} className="text-gray-700" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                        )}
                        <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors duration-300">
                            <ShoppingCart size={22} className="text-gray-700" />
                            {cartCount > 0 && (
                                <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-1.5 rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300"
                                >
                                    <UserCircle size={24} className="text-gray-700" />
                                    <span className="text-sm font-semibold hidden lg:inline text-gray-700">
                                        {(user.full_name || user.name || '').split(' ')[0]}
                                    </span>
                                    <ChevronDown size={16} className="text-gray-500" />
                                </button>

                                {/* User Dropdown */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{user.full_name || user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                        <Link
                                            to="/my-orders"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            My Orders
                                        </Link>
                                        <Link
                                            to="/dashboard"
                                            className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center space-x-1 font-semibold hover:text-black transition-colors duration-300 uppercase text-sm text-gray-700">
                                <User size={22} />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                        )}
                        
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden text-gray-700 hover:text-black transition-colors duration-300"
                        >
                            <Menu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <div className="relative ml-auto h-full w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-8">
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xl font-black tracking-tighter text-black"
                            >
                                URBANDRIP
                            </Link>
                            <button
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-gray-700 hover:text-black"
                            >
                                ✕
                            </button>
                        </div>

                        <nav className="space-y-4">
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-base font-semibold text-gray-800 hover:text-black transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/shop"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-base font-semibold text-gray-800 hover:text-black transition-colors"
                            >
                                Shop
                            </Link>

                            <div className="space-y-2">
                                <button
                                    type="button"
                                    onClick={() => setIsMobileCategoriesOpen((open) => !open)}
                                    className="w-full flex items-center justify-between text-left text-base font-semibold text-gray-800 hover:text-black transition-colors"
                                >
                                    <span>Categories</span>
                                    <ChevronDown size={18} className={`transition-transform duration-200 ${isMobileCategoriesOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isMobileCategoriesOpen && (
                                    <div className="space-y-2 pl-4 border-l border-gray-200">
                                        {categories.map((cat) => (
                                            <Link
                                                key={cat.slug}
                                                to={`/category/${cat.slug}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block text-sm text-gray-600 hover:text-black transition-colors"
                                            >
                                                {cat.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                to="/track-order"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="block text-base font-semibold text-gray-800 hover:text-black transition-colors"
                            >
                                Track Order
                            </Link>
                        </nav>

                        <div className="mt-8 border-t border-gray-200 pt-6 space-y-3">
                            {user ? (
                                <>
                                    <Link
                                        to="/my-orders"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-base font-semibold text-gray-800 hover:text-black transition-colors"
                                    >
                                        My Orders
                                    </Link>
                                    <Link
                                        to="/dashboard"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block text-base font-semibold text-gray-800 hover:text-black transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full text-left text-base font-semibold text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block text-base font-semibold text-gray-800 hover:text-black transition-colors"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay to close dropdown */}
            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                ></div>
            )}
        </nav>
    );
};

export default Navbar;