import { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, Users, Eye, ShoppingBag, UserPlus } from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        products: { total: 0, active: 0 },
        orders: { total: 0, today: 0 },
        revenue: { total: 0, today: 0 },
        customers: { total: 0 },
        visitors: { total: 0, today: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState({
        visits: [],
        orders: []
    });
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('urbandrip_token');
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/api/admin/stats`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );
                
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                    
                    // Create chart data for revenue trend (last 7 days)
                    const visitsData = (data.visitors.daily_visits || []).map(d => ({
                        date: d.date,
                        visits: d.visits
                    }));
                    // Pad to 7 days if needed
                    while (visitsData.length < 7) {
                        const date = new Date();
                        date.setDate(date.getDate() - (6 - visitsData.length));
                        visitsData.unshift({
                            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                            visits: 0
                        });
                    }
                    
                    // Create orders by status chart data
                    const ordersData = [
                        { name: 'Pending', value: Math.floor((data.orders.total || 0) * 0.2) },
                        { name: 'Processing', value: Math.floor((data.orders.total || 0) * 0.3) },
                        { name: 'Shipped', value: Math.floor((data.orders.total || 0) * 0.3) },
                        { name: 'Delivered', value: Math.floor((data.orders.total || 0) * 0.2) }
                    ];
                    
                    setChartData({
                        visits: visitsData,
                        orders: ordersData
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        fetchActivity();
        const interval = setInterval(fetchStats, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchActivity = async () => {
        try {
            const token = localStorage.getItem('urbandrip_token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/activity`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setActivities(data.activities || []);
            }
        } catch (err) {
            console.error('Error fetching activity:', err);
        }
    };

    if (loading) {
        return <div className="text-center py-20">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Package}
                    title="Total Revenue"
                    value={stats.revenue.total}
                    change={12.5}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Package}
                    title="Total Orders"
                    value={stats.orders.total}
                    change={8.2}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={Users}
                    title="Total Customers"
                    value={stats.customers.total}
                    change={15.3}
                    color="bg-green-500"
                />
                <StatCard
                    icon={Eye}
                    title="Site Visitors"
                    value={stats.visitors.total}
                    change={22.1}
                    color="bg-orange-500"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                        Revenue Over Time
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData.visits}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip />
                            <Line type="monotone" dataKey="visits" stroke="#000" dot={{ fill: '#000' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders by Status */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                        Orders by Status
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData.orders}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                <Cell fill="#3b82f6" />
                                <Cell fill="#8b5cf6" />
                                <Cell fill="#10b981" />
                                <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            {/* Activity Feed */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                    Recent Activity
                </h3>
                {activities.length === 0 ? (
                    <p className="font-['Inter'] text-sm text-gray-500 text-center py-6">No recent activity yet.</p>
                ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                        {activities.map((activity, idx) => (
                            <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                                <div className={`p-2 rounded-full flex-shrink-0 ${activity.type === 'signup' ? 'bg-green-100' : 'bg-blue-100'}`}>
                                    {activity.type === 'signup'
                                        ? <UserPlus className="w-4 h-4 text-green-600" />
                                        : <ShoppingBag className="w-4 h-4 text-blue-600" />
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-['Inter'] text-sm text-gray-800">{activity.message}</p>
                                    <p className="font-['Inter'] text-xs text-gray-400 mt-0.5">
                                        {new Date(activity.timestamp).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, change, color }) => {
    const IconCmp = icon;
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-['Inter'] text-gray-600 text-sm mb-1">{title}</p>
                    <p className="font-['Playfair_Display'] text-3xl font-bold text-gray-900">
                        {typeof value === 'number' && value > 1000
                            ? `₦${(value / 1000).toFixed(1)}K`
                            : value}
                    </p>
                    <p className={`font-['Inter'] text-xs mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendingUp className="w-3 h-3 inline mr-1" />
                        {change >= 0 ? '+' : ''}{change}% from last month
                    </p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <IconCmp className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;
