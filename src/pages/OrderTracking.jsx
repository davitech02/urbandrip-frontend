/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../services/api';
import { Package, Truck, CheckCircle, Search, Clock } from 'lucide-react';

const OrderTracking = () => {
    const location = useLocation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTxRef, setSearchTxRef] = useState('');
    const [searchedOrder, setSearchedOrder] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Check if we have a tx_ref from navigation
        const txRef = location.state?.txRef;
        if (txRef) {
            setSearchTxRef(txRef);
            handleTrackOrder(txRef);
        }
    }, [location.state]);

    const handleTrackOrder = async (txRef = searchTxRef) => {
        if (!txRef.trim()) {
            setError('Please enter a transaction reference');
            return;
        }

        setSearchLoading(true);
        setError('');

        try {
            const res = await API.get(`/orders/track/${txRef}`);
            setSearchedOrder(res.data.order);
        } catch (err) {
            console.error("Error tracking order:", err);
            setError('Order not found. Please check your transaction reference.');
            setSearchedOrder(null);
        } finally {
            setSearchLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'processing': return <Clock className="w-5 h-5 text-blue-500" />;
            case 'shipped': return <Truck className="w-5 h-5 text-yellow-500" />;
            case 'delivered': return <CheckCircle className="w-5 h-5 text-green-500" />;
            default: return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'shipped': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusProgress = (status) => {
        switch (status.toLowerCase()) {
            case 'processing': return 33;
            case 'shipped': return 66;
            case 'delivered': return 100;
            default: return 0;
        }
    };

    return (
        <div className="min-h-screen bg-white pt-20 pb-20">
            <div className="max-w-4xl mx-auto px-4">
                <h1 className="font-['Playfair_Display'] text-4xl font-bold text-gray-900 mb-12 text-center">
                    TRACK YOUR ORDER
                </h1>

                {/* Search Section */}
                <div className="bg-gray-50 p-8 rounded-md mb-12">
                    <h2 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900 mb-6">
                        Enter Your Transaction Reference
                    </h2>

                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={searchTxRef}
                            onChange={(e) => setSearchTxRef(e.target.value)}
                            placeholder="e.g., URBANDRIP-1234567890"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-md font-['Inter'] focus:outline-none focus:ring-2 focus:ring-black"
                            onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                        />
                        <button
                            onClick={() => handleTrackOrder()}
                            disabled={searchLoading}
                            className="bg-black text-white px-8 py-3 rounded-md font-['Inter'] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            {searchLoading ? 'SEARCHING...' : 'TRACK ORDER'}
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm mt-4">{error}</p>
                    )}
                </div>

                {/* Order Details */}
                {searchedOrder && (
                    <div className="bg-white border border-gray-200 rounded-md p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">
                                    Order #{searchedOrder.id}
                                </h3>
                                <p className="font-['Inter'] text-gray-600 mt-1">
                                    Transaction: {searchedOrder.tx_ref}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-full border font-['Inter'] font-medium flex items-center gap-2 ${getStatusStyle(searchedOrder.order_status)}`}>
                                {getStatusIcon(searchedOrder.order_status)}
                                {searchedOrder.order_status.toUpperCase()}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between text-sm font-['Inter'] text-gray-600 mb-2">
                                <span>Order Placed</span>
                                <span>Processing</span>
                                <span>Shipped</span>
                                <span>Delivered</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-black h-2 rounded-full transition-all duration-500"
                                    style={{ width: `${getStatusProgress(searchedOrder.order_status)}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Order Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                                    Customer Information
                                </h4>
                                <div className="space-y-2 font-['Inter'] text-gray-700">
                                    <p><span className="font-medium">Name:</span> {searchedOrder.customer_name}</p>
                                    <p><span className="font-medium">Email:</span> {searchedOrder.customer_email}</p>
                                    <p><span className="font-medium">Phone:</span> {searchedOrder.customer_phone}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                                    Delivery Information
                                </h4>
                                <div className="space-y-2 font-['Inter'] text-gray-700">
                                    <p><span className="font-medium">Method:</span> {searchedOrder.delivery_method}</p>
                                    <p><span className="font-medium">Address:</span> {searchedOrder.delivery_address.street}, {searchedOrder.delivery_address.city}, {searchedOrder.delivery_address.state}</p>
                                    <p><span className="font-medium">Total:</span> ₦{searchedOrder.total_amount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h4 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                                Order Items
                            </h4>
                            <div className="space-y-4">
                                {searchedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-md">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-['Inter'] font-medium text-gray-900">{item.name}</p>
                                            <p className="font-['Inter'] text-sm text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-['Inter'] font-bold text-gray-900">
                                            ₦{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Timeline */}
                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <h4 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                                Order Timeline
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <div>
                                        <p className="font-['Inter'] font-medium text-gray-900">Order Placed</p>
                                        <p className="font-['Inter'] text-sm text-gray-600">
                                            {new Date(searchedOrder.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {searchedOrder.order_status.toLowerCase() !== 'processing' && (
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${searchedOrder.order_status.toLowerCase() === 'processing' ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                                        <div>
                                            <p className="font-['Inter'] font-medium text-gray-900">Processing</p>
                                            <p className="font-['Inter'] text-sm text-gray-600">Your order is being prepared</p>
                                        </div>
                                    </div>
                                )}

                                {(searchedOrder.order_status.toLowerCase() === 'shipped' || searchedOrder.order_status.toLowerCase() === 'delivered') && (
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${searchedOrder.order_status.toLowerCase() === 'shipped' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                                        <div>
                                            <p className="font-['Inter'] font-medium text-gray-900">Shipped</p>
                                            <p className="font-['Inter'] text-sm text-gray-600">Your order is on the way</p>
                                        </div>
                                    </div>
                                )}

                                {searchedOrder.order_status.toLowerCase() === 'delivered' && (
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <div>
                                            <p className="font-['Inter'] font-medium text-gray-900">Delivered</p>
                                            <p className="font-['Inter'] text-sm text-gray-600">Your order has been delivered</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;