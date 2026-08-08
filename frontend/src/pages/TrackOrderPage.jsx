import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import {
    Search,
    Package,
    Truck,
    CheckCircle,
    MapPin,
    Clock,
    AlertCircle,
    ArrowRight
} from 'lucide-react';

const TrackOrderPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [orderRef, setOrderRef] = useState(searchParams.get('ref') || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        // If there's a ref in URL params, auto-search
        const ref = searchParams.get('ref');
        if (ref) {
            handleTrackOrder(ref);
        }
    }, []);

    const handleTrackOrder = async (ref = orderRef) => {
        if (!ref.trim()) {
            setError('Please enter an order reference');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSearched(true);

            const response = await API.get(`/api/orders/track/${ref.trim()}`);
            setOrder(response.data.order);

            // Update URL params
            setSearchParams({ ref: ref.trim() });
        } catch (err) {
            console.error('Error tracking order:', err);
            setError('Order not found. Please check your order reference and try again.');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleTrackOrder();
    };

    const getOrderSteps = () => {
        const steps = [
            {
                key: 'placed',
                label: 'Order Placed',
                description: 'Your order has been received',
                icon: Package,
                completed: true
            },
            {
                key: 'confirmed',
                label: 'Payment Confirmed',
                description: 'Payment has been processed',
                icon: CheckCircle,
                completed: order?.payment_status === 'successful'
            },
            {
                key: 'processing',
                label: 'Processing',
                description: 'Your order is being prepared',
                icon: Clock,
                completed: ['processing', 'shipped', 'delivered'].includes(order?.order_status)
            },
            {
                key: 'shipped',
                label: 'Shipped',
                description: 'Order has been shipped',
                icon: Truck,
                completed: ['shipped', 'delivered'].includes(order?.order_status)
            },
            {
                key: 'delivered',
                label: 'Delivered',
                description: 'Order has been delivered',
                icon: CheckCircle,
                completed: order?.order_status === 'delivered'
            }
        ];

        return steps;
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-['Playfair_Display'] text-4xl font-bold text-gray-900 mb-4">
                        TRACK YOUR ORDER
                    </h1>
                    <p className="text-gray-600 text-lg">
                        Enter your order reference to track your package
                    </p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label htmlFor="track-order-ref" className="sr-only">Order Reference</label>
                                <input
                                    id="track-order-ref"
                                    type="text"
                                    value={orderRef}
                                    onChange={(e) => setOrderRef(e.target.value)}
                                    placeholder="Enter order reference (e.g., TXN_123456)"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {loading ? 'Searching...' : 'TRACK'}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                    <p className="text-red-700">{error}</p>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Order Details */}
                {order && (
                    <div className="space-y-8">
                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                <div>
                                    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-2">
                                        Order #{order.tx_ref || order.id}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <span>Placed on {formatDate(order.created_at)}</span>
                                        <span>•</span>
                                        <span>{order.items?.length || 0} items</span>
                                        <span>•</span>
                                        <span className="font-medium text-gray-900">
                                            {formatCurrency(order.total_amount)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                                        order.order_status === 'delivered'
                                            ? 'bg-green-100 text-green-800'
                                            : order.order_status === 'shipped'
                                            ? 'bg-blue-100 text-blue-800'
                                            : order.order_status === 'processing'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Progress */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-8 text-center">
                                Order Progress
                            </h3>

                            <div className="relative">
                                {/* Progress Line */}
                                <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-200"></div>
                                <div
                                    className="absolute top-6 left-0 h-0.5 bg-black transition-all duration-500"
                                    style={{
                                        width: `${(getOrderSteps().filter(step => step.completed).length / getOrderSteps().length) * 100}%`
                                    }}
                                ></div>

                                {/* Steps */}
                                <div className="relative flex justify-between">
                                    {getOrderSteps().map((step, index) => {
                                        const Icon = step.icon;
                                        const isCompleted = step.completed;
                                        const isLast = index === getOrderSteps().length - 1;

                                        return (
                                            <div key={step.key} className="flex flex-col items-center">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                                                    isCompleted
                                                        ? 'bg-black border-black text-white'
                                                        : 'bg-white border-gray-300 text-gray-400'
                                                }`}>
                                                    <Icon className="h-6 w-6" />
                                                </div>

                                                <div className="mt-4 text-center max-w-32">
                                                    <h4 className={`font-medium text-sm ${
                                                        isCompleted ? 'text-gray-900' : 'text-gray-500'
                                                    }`}>
                                                        {step.label}
                                                    </h4>
                                                    <p className={`text-xs mt-1 ${
                                                        isCompleted ? 'text-gray-600' : 'text-gray-400'
                                                    }`}>
                                                        {step.description}
                                                    </p>
                                                </div>

                                                {!isLast && (
                                                    <ArrowRight className="hidden lg:block absolute top-6 -right-6 h-4 w-4 text-gray-300" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-6">
                                Order Items
                            </h3>

                            <div className="space-y-4">
                                {order.items && order.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                            <Package className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                                            <p className="text-gray-600 text-sm">
                                                Quantity: {item.quantity} × {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-medium text-gray-900">Total Amount:</span>
                                    <span className="font-bold text-gray-900">
                                        {formatCurrency(order.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        {order.delivery_address && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                                <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-6">
                                    Delivery Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                                        <div className="space-y-1 text-gray-600">
                                            <p>{order.customer_name}</p>
                                            <p>{order.customer_email}</p>
                                            {order.customer_phone && <p>{order.customer_phone}</p>}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div className="text-gray-600">
                                                {typeof order.delivery_address === 'object' ? (
                                                    <>
                                                        <p>{order.delivery_address.street}</p>
                                                        <p>{order.delivery_address.city}, {order.delivery_address.state}</p>
                                                        <p>{order.delivery_address.country} {order.delivery_address.postal_code}</p>
                                                    </>
                                                ) : (
                                                    <p>{order.delivery_address}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    to="/my-orders"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Package className="h-5 w-5 mr-2" />
                                    View All Orders
                                </Link>
                                <Link
                                    to="/shop"
                                    className="inline-flex items-center justify-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Order Found */}
                {searched && !order && !loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                        <div className="text-center">
                            <Search className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-2">
                                Order Not Found
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We couldn't find an order with that reference. Please check and try again.
                            </p>
                            <div className="space-y-4">
                                <p className="text-sm text-gray-500">
                                    Order references usually start with "TXN_" followed by numbers.
                                </p>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrderPage;