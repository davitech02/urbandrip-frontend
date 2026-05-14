import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import {
    ShoppingBag,
    Eye,
    Truck,
    Package,
    CheckCircle,
    XCircle,
    Clock,
    Search,
    Filter
} from 'lucide-react';

const MyOrdersPage = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        fetchOrders();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        filterOrders();
    }, [orders, activeFilter, searchTerm]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/api/orders/user/${user.id}`);
            setOrders(response.data.orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOrders = () => {
        let filtered = orders;

        // Filter by status
        if (activeFilter !== 'all') {
            filtered = filtered.filter(order => order.order_status === activeFilter);
        }

        // Filter by search term (order ID or transaction ref)
        if (searchTerm) {
            filtered = filtered.filter(order =>
                (order.tx_ref && order.tx_ref.toLowerCase().includes(searchTerm.toLowerCase())) ||
                order.id.toString().includes(searchTerm)
            );
        }

        setFilteredOrders(filtered);
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
            case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
            case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
            default: return <Package className="h-4 w-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'shipped': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getFilterTabs = () => [
        { key: 'all', label: 'All Orders', count: orders.length },
        { key: 'processing', label: 'Processing', count: orders.filter(o => o.order_status === 'processing').length },
        { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.order_status === 'shipped').length },
        { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.order_status === 'delivered').length },
        { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.order_status === 'cancelled').length }
    ];

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-['Playfair_Display'] text-3xl font-bold text-gray-900 mb-4">
                        MY ORDERS
                    </h1>

                    {/* Search Bar */}
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search by order ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-wrap gap-4">
                        {getFilterTabs().map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveFilter(tab.key)}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    activeFilter === tab.key
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {tab.label} ({tab.count})
                            </button>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading your orders...</p>
                        </div>
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Order Header */}
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">
                                                    Order #{order.tx_ref || order.id}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(order.order_status)}`}>
                                                    {getStatusIcon(order.order_status)}
                                                    {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm">
                                                Placed on {formatDate(order.created_at)}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            <Link
                                                to={`/track-order`}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <Truck className="h-4 w-4 mr-2" />
                                                Track Order
                                            </Link>
                                            <Link
                                                to={`/track-order`}
                                                className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                            >
                                                <Eye className="h-4 w-4 mr-2" />
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        {order.items && order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                                    <Package className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-gray-900">
                                                        {formatCurrency(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Total */}
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                                            <span className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(order.total_amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                        <div className="text-center">
                            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-2">
                                No orders found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                {activeFilter === 'all'
                                    ? "You haven't placed any orders yet."
                                    : `You don't have any ${activeFilter} orders.`
                                }
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <ShoppingBag className="h-5 w-5 mr-2" />
                                Start Shopping
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrdersPage;