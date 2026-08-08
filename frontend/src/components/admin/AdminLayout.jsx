import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart3, ShoppingBag, Package, Users, Eye, Settings, MessageSquare,
    Menu, X, LogOut, Bell, Search, ChevronDown
} from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', path: '/admin', icon: BarChart3 },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Site Visitors', path: '/admin/visitors', icon: Eye },
        { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    const currentNav = navLinks.find(link => location.pathname === link.path);
    const pageTitle = currentNav?.name || 'Admin Dashboard';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNav = (path) => {
        navigate(path);
        setSidebarOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#f8f8f8] overflow-hidden">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 fixed lg:static w-[260px] bg-[#111111] text-white left-0 top-0 h-screen overflow-y-auto transition-transform duration-300 z-40`}
            >
                <div className="p-6">
                    <div className="mb-8">
                        <h2 className="font-['Playfair_Display'] text-xl font-bold">URBAN DRIP</h2>
                        <p className="font-['Inter'] text-xs text-gray-400 mt-1">Admin Panel</p>
                    </div>

                    <nav className="space-y-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;

                            return (
                                <button
                                    key={link.path}
                                    onClick={() => handleNav(link.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-['Inter'] text-sm ${
                                        isActive
                                            ? 'bg-white text-black font-medium'
                                            : 'text-gray-400 hover:text-white hover:bg-[#222]'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{link.name}</span>
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 border-t border-gray-700 p-4 bg-[#0a0a0a]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                            <span className="font-['Inter'] font-bold text-white">
                                {user?.full_name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-['Inter'] text-sm font-medium text-white truncate">
                                {user?.full_name}
                            </p>
                            <p className="font-['Inter'] text-xs text-gray-400 truncate">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg font-['Inter'] text-sm font-medium transition-colors duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
                            >
                                {sidebarOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden lg:block"
                            >
                                {sidebarOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                            <h1 className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-gray-900">
                                {pageTitle}
                            </h1>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-4 py-2">
                                <Search className="w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent ml-2 outline-none font-['Inter'] text-sm w-32"
                                />
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-gray-200">
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="font-['Inter'] font-bold text-sm">
                                        {user?.full_name?.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 sm:p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
