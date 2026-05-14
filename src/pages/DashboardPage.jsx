import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
    User,
    ShoppingBag,
    Clock,
    CheckCircle,
    DollarSign,
    Settings,
    Heart,
    LogOut,
    Eye,
    Package,
    Truck,
    MapPin
} from 'lucide-react';

const DashboardPage = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        totalSpent: 0
    });
    const [loading, setLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (activeTab === 'overview') {
            fetchDashboardData();
        }
    }, [isAuthenticated, activeTab, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/api/orders/user/${user.id}`);
            const userOrders = response.data.orders;

            setOrders(userOrders);

            // Calculate stats
            const totalOrders = userOrders.length;
            const pendingOrders = userOrders.filter(order =>
                ['processing', 'shipped'].includes(order.order_status)
            ).length;
            const deliveredOrders = userOrders.filter(order =>
                order.order_status === 'delivered'
            ).length;
            const totalSpent = userOrders
                .filter(order => order.payment_status === 'successful')
                .reduce((sum, order) => sum + order.total_amount, 0);

            setStats({
                totalOrders,
                pendingOrders,
                deliveredOrders,
                totalSpent
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        // TODO: Implement profile update
        alert('Profile update functionality coming soon!');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        // TODO: Implement password change
        alert('Password change functionality coming soon!');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'bg-yellow-100 text-yellow-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            {/* User Info */}
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white text-2xl font-bold">
                                        {(user.full_name || user.name || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">
                                    {user.full_name || user.name}
                                </h3>
                                <p className="text-gray-600 text-sm">{user.email}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab('overview')}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                                        activeTab === 'overview'
                                            ? 'bg-black text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    Overview
                                </button>
                                <Link
                                    to="/my-orders"
                                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors block"
                                >
                                    My Orders
                                </Link>
                                <button
                                    onClick={() => setActiveTab('wishlist')}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                                        activeTab === 'wishlist'
                                            ? 'bg-black text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Heart size={16} className="inline mr-2" />
                                    Wishlist
                                </button>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                                        activeTab === 'profile'
                                            ? 'bg-black text-white'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Settings size={16} className="inline mr-2" />
                                    Profile Settings
                                </button>
                                <button
                                    onClick={logout}
                                    className="w-full text-left px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} className="inline mr-2" />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {activeTab === 'overview' && (
                            <div>
                                {/* Welcome Message */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-2">
                                        Welcome back, {(user.full_name || user.name || '').split(' ')[0]}!
                                    </h1>
                                    <p className="text-gray-600">
                                        Here's what's happening with your orders today.
                                    </p>
                                </div>

                                {/* Stats Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                                                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                                            </div>
                                            <ShoppingBag className="h-8 w-8 text-gray-400" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                                                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
                                            </div>
                                            <Clock className="h-8 w-8 text-yellow-500" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm font-medium">Delivered Orders</p>
                                                <p className="text-3xl font-bold text-gray-900">{stats.deliveredOrders}</p>
                                            </div>
                                            <CheckCircle className="h-8 w-8 text-green-500" />
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                                                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                                            </div>
                                            <DollarSign className="h-8 w-8 text-green-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Recent Orders */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-900">
                                            Recent Orders
                                        </h2>
                                    </div>

                                    {loading ? (
                                        <div className="p-8 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Order ID
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Items
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Total
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Date
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Action
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {orders.slice(0, 5).map((order) => (
                                                        <tr key={order.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                #{order.tx_ref || order.id}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {order.items?.length || 0} items
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {formatCurrency(order.total_amount)}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.order_status)}`}>
                                                                    {order.order_status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {new Date(order.created_at).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <Link
                                                                    to={`/track-order`}
                                                                    className="text-black hover:underline font-medium"
                                                                >
                                                                    View Details
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center">
                                            <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                                            <p className="text-gray-500 mb-4">Start shopping to see your orders here.</p>
                                            <Link
                                                to="/shop"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800"
                                            >
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                {/* Profile Settings */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">
                                        Profile Settings
                                    </h2>

                                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={profileData.full_name}
                                                    onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Phone Number
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                                />
                                            </div>

                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Delivery Address
                                                </label>
                                                <textarea
                                                    value={profileData.address}
                                                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                                    rows={3}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                                    placeholder="Enter your delivery address"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                                        >
                                            Save Changes
                                        </button>
                                    </form>
                                </div>

                                {/* Change Password */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">
                                        Change Password
                                    </h2>

                                    <form onSubmit={handlePasswordChange} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
                                        >
                                            Update Password
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

                        {activeTab === 'wishlist' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">
                                    My Wishlist
                                </h2>

                                {/* TODO: Implement wishlist functionality */}
                                <div className="text-center py-12">
                                    <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                                    <p className="text-gray-500 mb-6">Save items you love for later.</p>
                                    <Link
                                        to="/shop"
                                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;