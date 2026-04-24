import { useState, useEffect } from 'react';
import API from '../../services/api';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        site_name: 'Urban Drip',
        support_email: '',
        support_phone: '',
        shipping_fee: 0,
        free_shipping_threshold: 0
    });

    const [discountCodes, setDiscountCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCodeModal, setShowCodeModal] = useState(false);
    const [editingCodeId, setEditingCodeId] = useState(null);
    const [codeForm, setCodeForm] = useState({
        code: '',
        discount_percentage: '',
        max_uses: '',
        expiry_date: ''
    });

    useEffect(() => {
        fetchSettings();
        fetchDiscountCodes();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await API.get('/admin/settings');
            setSettings(res.data.settings || {});
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchDiscountCodes = async () => {
        try {
            const res = await API.get('/admin/discount-codes');
            setDiscountCodes(res.data.codes || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching discount codes:', error);
            // Show empty list on error
            setDiscountCodes([]);
            setLoading(false);
        }
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.put('/admin/settings', settings);
            alert('Settings updated successfully');
            fetchSettings();
        } catch (error) {
            console.error('Error updating settings:', error);
        }
    };

    const handleCodeSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...codeForm,
                discount_percentage: parseFloat(codeForm.discount_percentage),
                max_uses: parseInt(codeForm.max_uses)
            };

            if (editingCodeId) {
                await API.put(`/admin/discount-codes/${editingCodeId}`, payload);
            } else {
                await API.post('/admin/discount-codes', payload);
            }

            setShowCodeModal(false);
            setEditingCodeId(null);
            setCodeForm({ code: '', discount_percentage: '', max_uses: '', expiry_date: '' });
            fetchDiscountCodes();
        } catch (error) {
            console.error('Error saving discount code:', error);
        }
    };

    const handleEditCode = (code) => {
        setEditingCodeId(code.id);
        setCodeForm({
            code: code.code,
            discount_percentage: code.discount_percentage,
            max_uses: code.max_uses,
            expiry_date: code.expiry_date || ''
        });
        setShowCodeModal(true);
    };

    const handleDeleteCode = async (id) => {
        if (window.confirm('Are you sure you want to delete this discount code?')) {
            try {
                await API.delete(`/admin/discount-codes/${id}`);
                fetchDiscountCodes();
            } catch (error) {
                console.error('Error deleting discount code:', error);
            }
        }
    };

    if (loading) return <div className="text-center py-20">Loading settings...</div>;

    return (
        <div className="space-y-6">
            {/* Store Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-900 mb-6">
                    Store Settings
                </h2>

                <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                value={settings.site_name}
                                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                Support Email
                            </label>
                            <input
                                type="email"
                                value={settings.support_email}
                                onChange={(e) => setSettings({ ...settings, support_email: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                Support Phone
                            </label>
                            <input
                                type="tel"
                                value={settings.support_phone}
                                onChange={(e) => setSettings({ ...settings, support_phone: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                Shipping Fee (₦)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.shipping_fee}
                                onChange={(e) => setSettings({ ...settings, shipping_fee: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                Free Shipping Threshold (₦)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={settings.free_shipping_threshold}
                                onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                        >
                            Save Settings
                        </button>
                    </div>
                </form>
            </div>

            {/* Discount Codes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-['Playfair_Display'] text-xl font-bold text-gray-900">
                        Discount Codes
                    </h2>
                    <button
                        onClick={() => {
                            setEditingCodeId(null);
                            setCodeForm({ code: '', discount_percentage: '', max_uses: '', expiry_date: '' });
                            setShowCodeModal(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-['Inter'] text-sm font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Code
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Code</th>
                                <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Discount</th>
                                <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Uses/Max</th>
                                <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Expiry</th>
                                <th className="px-6 py-3 text-right font-['Inter'] text-sm font-bold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {discountCodes.map((code) => (
                                <tr key={code.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-['Inter'] font-medium text-gray-900">{code.code}</td>
                                    <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">{code.discount_percentage}%</td>
                                    <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">
                                        {code.usage_count}/{code.max_uses}
                                    </td>
                                    <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">
                                        {code.expiry_date ? new Date(code.expiry_date).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                                        <button
                                            onClick={() => handleEditCode(code)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCode(code.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Discount Code Modal */}
            {showCodeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-['Playfair_Display'] text-lg font-bold">
                                {editingCodeId ? 'Edit Discount Code' : 'Add Discount Code'}
                            </h3>
                            <button onClick={() => setShowCodeModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>

                        <form onSubmit={handleCodeSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                    Code
                                </label>
                                <input
                                    type="text"
                                    value={codeForm.code}
                                    onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value.toUpperCase() })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                    disabled={!!editingCodeId}
                                />
                            </div>

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                    Discount Percentage
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={codeForm.discount_percentage}
                                    onChange={(e) => setCodeForm({ ...codeForm, discount_percentage: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                    Max Uses
                                </label>
                                <input
                                    type="number"
                                    value={codeForm.max_uses}
                                    onChange={(e) => setCodeForm({ ...codeForm, max_uses: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-2">
                                    Expiry Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={codeForm.expiry_date}
                                    onChange={(e) => setCodeForm({ ...codeForm, expiry_date: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                                >
                                    {editingCodeId ? 'Update Code' : 'Add Code'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCodeModal(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSettings;
