import { useState, useEffect } from 'react';
import { ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    const API_URL = import.meta.env.VITE_API_URL;

    const fetchCustomers = async () => {
        try {
            const token = localStorage.getItem('urbandrip_token');
            const response = await fetch(
                `${API_URL}/api/admin/customers`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const data = await response.json();
            if (response.ok) {
                setCustomers(data.customers || []);
            } else {
                setCustomers([]);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching customers:', error);
            setCustomers([]);
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        (async () => {
            try {
                const token = localStorage.getItem('urbandrip_token');
                const response = await fetch(`${API_URL}/api/admin/customers`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                    signal: controller.signal
                });
                const data = await response.json();
                setCustomers(data.customers || []);
                setLoading(false);
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error('Error fetching customers:', error);
                    setCustomers([]);
                    setLoading(false);
                }
            }
        })();
        return () => controller.abort();
    }, []);

    const handleToggleStatus = async (customerId, currentStatus) => {
        try {
            const token = localStorage.getItem('urbandrip_token');
            const response = await fetch(
                `${API_URL}/api/admin/customers/${customerId}/status`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        is_active: !currentStatus
                    })
                }
            );
            
            if (response.ok) {
                toast.success('Customer status updated!');
                fetchCustomers();
            }
        } catch (error) {
            console.error('Error toggling customer status:', error);
            toast.error('Failed to update status');
        }
    };

    if (loading) return <div className="text-center py-20">Loading customers...</div>;

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h2 className="font-['Playfair_Display'] text-2xl font-bold">Customers Management</h2>
                <p className="font-['Inter'] text-gray-600 text-sm mt-1">Total customers: {customers.length}</p>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Customer</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Email</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Phone</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Orders</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Total Spent</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-right font-['Inter'] text-sm font-bold text-gray-900">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {customers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">{customer.full_name}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">{customer.email}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">{customer.phone || 'N/A'}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">{customer.order_count || 0}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">₦{(customer.total_spent || 0).toLocaleString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${customer.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {customer.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(customer.id, customer.is_active)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        {customer.is_active ? (
                                            <ToggleRight className="w-4 h-4 text-green-600" />
                                        ) : (
                                            <ToggleLeft className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Customer Details Modal */}
            {showModal && selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="font-['Playfair_Display'] text-lg font-bold">Customer Profile</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div>
                                <h4 className="font-['Inter'] font-bold text-gray-900 mb-3">Personal Information</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-['Inter'] text-xs text-gray-600">Full Name</p>
                                        <p className="font-['Inter'] text-sm text-gray-900">{selectedCustomer.full_name}</p>
                                    </div>
                                    <div>
                                        <p className="font-['Inter'] text-xs text-gray-600">Email</p>
                                        <p className="font-['Inter'] text-sm text-gray-900">{selectedCustomer.email}</p>
                                    </div>
                                    <div>
                                        <p className="font-['Inter'] text-xs text-gray-600">Phone</p>
                                        <p className="font-['Inter'] text-sm text-gray-900">{selectedCustomer.phone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="font['Inter'] text-xs text-gray-600">Member Since</p>
                                        <p className="font-['Inter'] text-sm text-gray-900">
                                            {new Date(selectedCustomer.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Stats */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-['Inter'] font-bold text-gray-900 mb-3">Order Statistics</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">
                                            {selectedCustomer.order_count || 0}
                                        </p>
                                        <p className="font-['Inter'] text-xs text-gray-600">Total Orders</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">
                                            ₦{(selectedCustomer.total_spent || 0).toLocaleString()}
                                        </p>
                                        <p className="font-['Inter'] text-xs text-gray-600">Total Spent</p>
                                    </div>
                                    <div className="text-center">
                                        <p className={`font-['Playfair_Display'] text-2xl font-bold ${selectedCustomer.is_active ? 'text-green-600' : 'text-red-600'}`}>
                                            {selectedCustomer.is_active ? 'Active' : 'Inactive'}
                                        </p>
                                        <p className="font-['Inter'] text-xs text-gray-600">Status</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order History */}
                            {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
                                <div>
                                    <h4 className="font-['Inter'] font-bold text-gray-900 mb-3">Recent Orders</h4>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {selectedCustomer.orders.slice(0, 5).map((order) => (
                                            <div key={order.id} className="border border-gray-200 rounded-lg p-3">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="font-['Inter'] font-medium text-gray-900">Order #{order.id}</p>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded capitalize ${
                                                        order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.order_status}
                                                    </span>
                                                </div>
                                                <p className="font-['Inter'] text-sm text-gray-600">
                                                    ₦{order.total_amount.toLocaleString()} • {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCustomers;
