import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
    ShoppingBag, Clock, CheckCircle, DollarSign,
    Settings, Bell, LogOut, Package, BellRing
} from 'lucide-react';
import toast from 'react-hot-toast';

const DashboardPage = () => {
    const { user, logout, isAuthenticated, setUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [stats, setStats] = useState({ totalOrders: 0, pendingOrders: 0, deliveredOrders: 0, totalSpent: 0 });
    const [loading, setLoading] = useState(true);
    const [notifLoading, setNotifLoading] = useState(false);
    const [profileData, setProfileData] = useState({ full_name: '', email: '', phone: '' });
    const [profileSaving, setProfileSaving] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordSaving, setPasswordSaving] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        setProfileData({ full_name: user?.full_name || '', email: user?.email || '', phone: user?.phone || '' });
    }, [isAuthenticated, user, navigate]);

    useEffect(() => {
        if (!isAuthenticated || !user) return;
        if (activeTab === 'overview') fetchDashboardData();
        if (activeTab === 'notifications') fetchNotifications();
    }, [activeTab, isAuthenticated, user]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/api/orders/user/${user.id}`);
            const userOrders = response.data.orders || [];
            setOrders(userOrders);
            setStats({
                totalOrders: userOrders.length,
                pendingOrders: userOrders.filter(o => ['processing', 'shipped'].includes(o.order_status)).length,
                deliveredOrders: userOrders.filter(o => o.order_status === 'delivered').length,
                totalSpent: userOrders.filter(o => o.payment_status === 'successful').reduce((s, o) => s + o.total_amount, 0)
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            setNotifLoading(true);
            const res = await API.get('/api/messages/my');
            setNotifications(res.data.messages || []);
            setUnreadCount(res.data.unread_count || 0);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setNotifLoading(false);
        }
    };

    // On mount, fetch unread count + notifications in one call (no notif spinner)
    useEffect(() => {
        if (!isAuthenticated) return;
        const fetchInitial = async () => {
            try {
                const res = await API.get('/api/messages/my');
                setNotifications(res.data.messages || []);
                setUnreadCount(res.data.unread_count || 0);
            } catch (e) { console.error(e); }
        };
        fetchInitial();
    }, [isAuthenticated]);

    const markAsRead = async (messageId) => {
        try {
            await API.put(`/api/messages/${messageId}/read`);
            setNotifications(prev => prev.map(m => m.id === messageId ? { ...m, is_read: true } : m));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Error marking as read:', err);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!profileData.full_name.trim()) {
            toast.error('Full name is required');
            return;
        }
        setProfileSaving(true);
        try {
            const res = await API.put('/api/auth/update-profile', {
                full_name: profileData.full_name,
                phone: profileData.phone
            });
            toast.success('Profile updated successfully!');
            const updatedUser = res.data.user;
            localStorage.setItem('urbandrip_user', JSON.stringify(updatedUser));
            setUser(updatedUser);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update profile');
        } finally {
            setProfileSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwordData.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }
        setPasswordSaving(true);
        try {
            await API.put('/api/auth/change-password', {
                current_password: passwordData.currentPassword,
                new_password: passwordData.newPassword
            });
            toast.success('Password changed successfully!');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to change password');
        } finally {
            setPasswordSaving(false);
        }
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

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);

    if (!isAuthenticated) return null;

    const tabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'notifications', label: 'Notifications', badge: unreadCount },
        { key: 'profile', label: 'Profile Settings' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pt-6 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="text-center mb-6">
                                <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-white text-2xl font-bold font-['Playfair_Display']">
                                        {(user?.full_name || 'U').charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">{user?.full_name}</h3>
                                <p className="text-gray-500 text-sm">{user?.email}</p>
                            </div>

                            <nav className="space-y-1">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-lg font-['Inter'] font-medium transition-colors ${
                                            activeTab === tab.key ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <span>{tab.label}</span>
                                        {tab.badge > 0 && (
                                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                                {tab.badge}
                                            </span>
                                        )}
                                    </button>
                                ))}
                                <Link
                                    to="/my-orders"
                                    className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-lg font-['Inter'] font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <ShoppingBag size={16} />
                                    My Orders
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-2 text-left px-4 py-3 rounded-lg font-['Inter'] font-medium text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:w-3/4">
                        {/* OVERVIEW TAB */}
                        {activeTab === 'overview' && (
                            <div>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-1">
                                        Welcome back, {(user?.full_name || '').split(' ')[0]}!
                                    </h1>
                                    <p className="text-gray-500">Here's what's happening with your orders.</p>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    {[
                                        { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'text-gray-400' },
                                        { label: 'Pending', value: stats.pendingOrders, icon: Clock, color: 'text-yellow-500' },
                                        { label: 'Delivered', value: stats.deliveredOrders, icon: CheckCircle, color: 'text-green-500' },
                                        { label: 'Total Spent', value: formatCurrency(stats.totalSpent), icon: DollarSign, color: 'text-green-500' }
                                    ].map(({ label, value, icon, color }) => {
                                        const Cmp = icon;
                                        return (
                                            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-gray-500 text-xs font-medium font-['Inter']">{label}</p>
                                                        <p className="text-2xl font-bold text-gray-900 font-['Playfair_Display'] mt-1">{value}</p>
                                                    </div>
                                                    <Cmp className={`h-7 w-7 ${color}`} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200">
                                        <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-900">Recent Orders</h2>
                                    </div>
                                    {loading ? (
                                        <div className="p-8 text-center">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        {['Order ID', 'Items', 'Total', 'Status', 'Date', 'Track'].map(h => (
                                                            <th key={h} className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-['Inter']">{h}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {orders.slice(0, 5).map((order) => (
                                                        <tr key={order.id} className="hover:bg-gray-50">
                                                            <td className="px-5 py-4 text-sm font-medium text-gray-900 font-['Inter']">#{order.tx_ref || order.id}</td>
                                                            <td className="px-5 py-4 text-sm text-gray-500 font-['Inter']">{order.items?.length || 0} items</td>
                                                            <td className="px-5 py-4 text-sm text-gray-900 font-['Inter']">{formatCurrency(order.total_amount)}</td>
                                                            <td className="px-5 py-4">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full font-['Inter'] capitalize ${getStatusColor(order.order_status)}`}>
                                                                    {order.order_status}
                                                                </span>
                                                            </td>
                                                            <td className="px-5 py-4 text-sm text-gray-500 font-['Inter']">{new Date(order.created_at).toLocaleDateString()}</td>
                                                            <td className="px-5 py-4 text-sm">
                                                                <Link
                                                                    to={`/track-order?ref=${order.tx_ref || order.id}`}
                                                                    className="text-black hover:underline font-medium font-['Inter']"
                                                                >
                                                                    Track
                                                                </Link>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center">
                                            <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                            <h3 className="font-['Playfair_Display'] text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                                            <p className="text-gray-500 mb-4 font-['Inter']">Start shopping to see your orders here.</p>
                                            <Link to="/shop" className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 font-['Inter']">
                                                Start Shopping
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* NOTIFICATIONS TAB */}
                        {activeTab === 'notifications' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200 flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-gray-700" />
                                    <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-900">Notifications</h2>
                                    {unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
                                    )}
                                </div>

                                {notifLoading ? (
                                    <div className="p-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto" />
                                    </div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-16 text-center">
                                        <BellRing className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                                        <h3 className="font-['Playfair_Display'] text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                                        <p className="text-gray-500 font-['Inter'] text-sm">You'll see messages from Urban Drip here.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100">
                                        {notifications.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`p-6 transition-colors ${!msg.is_read ? 'bg-blue-50' : 'bg-white'}`}
                                            >
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                            {!msg.is_read && (
                                                                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                                            )}
                                                            <p className="font-['Inter'] font-semibold text-gray-900 text-sm">
                                                                {msg.subject || 'Message from Urban Drip'}
                                                            </p>
                                                            {msg.order_id && (
                                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-['Inter']">
                                                                    Order #{msg.order_id}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="font-['Inter'] text-sm text-gray-700 leading-relaxed">{msg.message}</p>
                                                        <p className="font-['Inter'] text-xs text-gray-400 mt-2">
                                                            {new Date(msg.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>
                                                    {!msg.is_read && (
                                                        <button
                                                            onClick={() => markAsRead(msg.id)}
                                                            className="flex-shrink-0 text-xs text-blue-600 hover:text-blue-800 font-['Inter'] font-medium"
                                                        >
                                                            Mark read
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="space-y-8">
                                {/* Profile Settings */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
                                    <form onSubmit={handleProfileUpdate} className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-['Inter']">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={profileData.full_name}
                                                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black font-['Inter']"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-['Inter']">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    readOnly
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-400 font-['Inter']"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-['Inter']">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={profileData.phone}
                                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black font-['Inter']"
                                                    placeholder="+234..."
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={profileSaving}
                                            className="bg-black text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 font-['Inter']"
                                        >
                                            {profileSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </form>
                                </div>

                                {/* Change Password */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">Change Password</h2>
                                    <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                                        {[
                                            { label: 'Current Password', key: 'currentPassword' },
                                            { label: 'New Password', key: 'newPassword' },
                                            { label: 'Confirm New Password', key: 'confirmPassword' }
                                        ].map(({ label, key }) => (
                                            <div key={key}>
                                                <label className="block text-sm font-medium text-gray-700 mb-1 font-['Inter']">{label}</label>
                                                <input
                                                    type="password"
                                                    value={passwordData[key]}
                                                    onChange={(e) => setPasswordData({ ...passwordData, [key]: e.target.value })}
                                                    required
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black font-['Inter']"
                                                />
                                            </div>
                                        ))}
                                        <button
                                            type="submit"
                                            disabled={passwordSaving}
                                            className="bg-black text-white px-6 py-2.5 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 font-['Inter']"
                                        >
                                            {passwordSaving ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>
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
