import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart3, ShoppingBag, Package, Users, Eye, Settings,
    Menu, X, LogOut, Bell, Search, ChevronDown
} from 'lucide-react';

// Admin page imports
import AdminOverview from '../../pages/admin/AdminOverview';
import AdminProducts from '../../pages/admin/AdminProducts';
import AdminOrders from '../../pages/admin/AdminOrders';
import AdminCustomers from '../../pages/admin/AdminCustomers';
import AdminVisitors from '../../pages/admin/AdminVisitors';
import AdminSettings from '../../pages/admin/AdminSettings';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navLinks = [
        { name: 'Dashboard', path: '/admin', icon: BarChart3 },
        { name: 'Products', path: '/admin/products', icon: Package },
        { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
        { name: 'Customers', path: '/admin/customers', icon: Users },
        { name: 'Site Visitors', path: '/admin/visitors', icon: Eye },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    // Determine which page to show based on pathname
    const renderAdminPage = () => {
        const path = location.pathname;
        
        if (path === '/admin' || path === '/admin/') {
            return <AdminOverview />;
        } else if (path === '/admin/products') {
            return <AdminProducts />;
        } else if (path === '/admin/orders') {
            return <AdminOrders />;
        } else if (path === '/admin/customers') {
            return <AdminCustomers />;
        } else if (path === '/admin/visitors') {
            return <AdminVisitors />;
        } else if (path === '/admin/settings') {
            return <AdminSettings />;
        }
        return <AdminOverview />;
    };

    const currentNav = navLinks.find(link => location.pathname === link.path);
    const pageTitle = currentNav?.name || 'Admin Dashboard';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#f8f8f8]">
            {/* Sidebar */}
            <div
                className={`${
                    sidebarOpen ? 'w-[260px]' : 'w-0'
                } bg-[#111111] text-white fixed left-0 top-0 h-screen overflow-y-auto transition-all duration-300 z-40`}
            >
                <div className="p-6">
                    {/* Logo */}
                    <div className="mb-8">
                        <h2 className="font-['Playfair_Display'] text-xl font-bold">URBAN DRIP</h2>
                        <p className="font-['Inter'] text-xs text-gray-400 mt-1">Admin Panel</p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = location.pathname === link.path;

                            return (
                                <button
                                    key={link.path}
                                    onClick={() => navigate(link.path)}
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

                {/* Bottom Admin Profile */}
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
            <div className={`${sidebarOpen ? 'ml-[260px]' : 'ml-0'} flex-1 flex flex-col transition-all duration-300`}>
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between h-16 px-6">
                        {/* Left: Toggle & Title */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                {sidebarOpen ? (
                                    <X className="w-5 h-5" />
                                ) : (
                                    <Menu className="w-5 h-5" />
                                )}
                            </button>
                            <h1 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">
                                {pageTitle}
                            </h1>
                        </div>

                        {/* Right: Search, Notifications, Avatar */}
                        <div className="flex items-center gap-4">
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
                            <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
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
                    <div className="p-6">
                        {renderAdminPage()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
