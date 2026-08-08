import { useState, useEffect } from 'react';
import { Send, MessageSquare, User, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminMessages = () => {
    const [customers, setCustomers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCompose, setShowCompose] = useState(false);
    const [filterRecipient, setFilterRecipient] = useState('');
    const [sending, setSending] = useState(false);
    const [form, setForm] = useState({
        recipient_id: '',
        subject: '',
        message: '',
        order_id: ''
    });

    const API_URL = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem('urbandrip_token');

    useEffect(() => {
        fetchCustomers();
        fetchMessages();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/customers`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setCustomers((data.customers || []).filter(c => c.role !== 'admin'));
        } catch (err) {
            console.error('Error fetching customers:', err);
        }
    };

    const fetchMessages = async () => {
        try {
            const url = filterRecipient
                ? `${API_URL}/api/messages/admin/all?recipient_id=${filterRecipient}`
                : `${API_URL}/api/messages/admin/all`;
            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setMessages(data.messages || []);
        } catch (err) {
            console.error('Error fetching messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [filterRecipient]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!form.recipient_id || !form.message.trim()) {
            toast.error('Please select a recipient and enter a message');
            return;
        }
        setSending(true);
        try {
            const res = await fetch(`${API_URL}/api/messages/send`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    recipient_id: parseInt(form.recipient_id),
                    subject: form.subject || 'Message from Urban Drip',
                    message: form.message,
                    order_id: form.order_id ? parseInt(form.order_id) : null
                })
            });
            if (res.ok) {
                toast.success('Message sent successfully!');
                setShowCompose(false);
                setForm({ recipient_id: '', subject: '', message: '', order_id: '' });
                fetchMessages();
            } else {
                const d = await res.json();
                toast.error(d.error || 'Failed to send message');
            }
        } catch {
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const getRecipientName = (id) => {
        const c = customers.find(c => c.id === id);
        return c ? c.full_name : `User #${id}`;
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="font-['Playfair_Display'] text-2xl font-bold">Messages</h2>
                    <p className="font-['Inter'] text-sm text-gray-600 mt-1">Send notifications to customers about their orders</p>
                </div>
                <button
                    onClick={() => setShowCompose(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-['Inter'] text-sm font-medium transition-colors"
                >
                    <Send className="w-4 h-4" />
                    Compose Message
                </button>
            </div>

            {/* Filter */}
            <div className="mb-4">
                <select
                    value={filterRecipient}
                    onChange={(e) => setFilterRecipient(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500"
                >
                    <option value="">All Recipients</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>
                    ))}
                </select>
            </div>

            {/* Messages List */}
            {loading ? (
                <div className="text-center py-20">Loading messages...</div>
            ) : messages.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="font-['Inter'] text-gray-500">No messages sent yet.</p>
                    <p className="font-['Inter'] text-sm text-gray-400 mt-1">Use "Compose Message" to notify customers about their orders.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div key={msg.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                        <User className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-['Inter'] text-sm font-bold text-gray-900">
                                                To: {msg.recipient_name || getRecipientName(msg.recipient_id)}
                                            </span>
                                            {msg.recipient_email && (
                                                <span className="font-['Inter'] text-xs text-gray-500">({msg.recipient_email})</span>
                                            )}
                                            {msg.order_id && (
                                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-['Inter']">
                                                    Order #{msg.order_id}
                                                </span>
                                            )}
                                            {msg.is_read ? (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-['Inter']">Read</span>
                                            ) : (
                                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-['Inter']">Unread</span>
                                            )}
                                        </div>
                                        {msg.subject && (
                                            <p className="font-['Inter'] text-sm font-medium text-gray-800 mt-1">{msg.subject}</p>
                                        )}
                                        <p className="font-['Inter'] text-sm text-gray-700 mt-1">{msg.message}</p>
                                    </div>
                                </div>
                                <span className="font-['Inter'] text-xs text-gray-400 flex-shrink-0">
                                    {new Date(msg.timestamp).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Compose Modal */}
            {showCompose && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full shadow-xl">
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="font-['Playfair_Display'] text-lg font-bold">Compose Message</h3>
                            <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSend} className="p-6 space-y-4">
                            <div>
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                    Recipient <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={form.recipient_id}
                                    onChange={(e) => setForm({ ...form, recipient_id: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500"
                                >
                                    <option value="">Select a customer...</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>
                                            {c.full_name} — {c.email}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    value={form.subject}
                                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                    placeholder="e.g. Your order has been shipped"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                    Order ID (optional)
                                </label>
                                <input
                                    type="number"
                                    value={form.order_id}
                                    onChange={(e) => setForm({ ...form, order_id: e.target.value })}
                                    placeholder="Link to a specific order"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block font-['Inter'] text-sm font-medium text-gray-700 mb-1">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    required
                                    rows={5}
                                    placeholder="Write your message here..."
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-['Inter'] text-sm focus:outline-none focus:border-blue-500 resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2 border-t">
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-lg font-['Inter'] font-medium transition-colors"
                                >
                                    {sending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                                    {sending ? 'Sending...' : 'Send Message'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCompose(false)}
                                    disabled={sending}
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

export default AdminMessages;
