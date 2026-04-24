import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Eye, Edit2 } from 'lucide-react';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const statuses = ['processing', 'shipped', 'delivered', 'cancelled'];

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(o => o.order_status === statusFilter));
        }
    }, [statusFilter, orders]);

    const fetchOrders = async () => {
        try {
            const res = await API.get('/admin/all');
            setOrders(res.data.orders || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Show empty list on error
            setOrders([]);
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!newStatus || !selectedOrder) return;

        try {
            await API.put(`/admin/orders/${selectedOrder.id}/status`, {
                status: newStatus,
                note: `Status updated to ${newStatus}`
            });

            setShowModal(false);
            setSelectedOrder(null);
            setNewStatus('');
            fetchOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) return <div className="text-center py-20">Loading orders...</div>;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold mb-4">Orders Management</h2>

                {/* Status Filter */}
                <div className="flex gap-2 flex-wrap">
                    {['all', ...statuses].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg font-['Inter'] text-sm font-medium transition-colors capitalize ${
                                statusFilter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {status === 'all' ? 'All Orders' : status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Order ID</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Customer</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Amount</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Date</th>
                            <th className="px-6 py-3 text-right font-['Inter'] text-sm font-bold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-['Inter'] text-sm text-blue-600 font-medium">#{order.id}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">{order.user?.full_name}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">₦{order.total_amount.toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                        order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                        order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                        order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {order.order_status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setNewStatus(order.order_status);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Status Update Modal */}
            {showModal && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-['Playfair_Display'] text-lg font-bold">Update Order Status</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <p className="font-['Inter'] text-sm text-gray-600 mb-2">Order #{selectedOrder.id}</p>
                                <p className="font-['Inter'] text-sm text-gray-900">{selectedOrder.user?.full_name}</p>
                            </div>

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium mb-2">New Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                >
                                    {statuses.map((status) => (
                                        <option key={status} value={status} className="capitalize">
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedOrder.tracking_history && selectedOrder.tracking_history.length > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <p className="font-['Inter'] text-xs font-bold text-gray-600 mb-2">Tracking History</p>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                        {selectedOrder.tracking_history.map((entry, idx) => (
                                            <div key={idx} className="font-['Inter'] text-xs text-gray-600">
                                                <p className="font-medium capitalize">{entry.status}</p>
                                                <p className="text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={handleUpdateStatus}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                                >
                                    Update Status
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
