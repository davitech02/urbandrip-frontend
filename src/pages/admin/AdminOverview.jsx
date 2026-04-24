import { useState, useEffect } from 'react';
import API from '../../services/api';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Package, Users, Eye } from 'lucide-react';

const AdminOverview = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        visitors: 0
    });
    const [chartData, setChartData] = useState({
        revenue: [],
        orders: [],
        visits: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get visitor stats
                const visitorRes = await API.get('/admin/visitors/stats');
                const visitorData = visitorRes.data;

                // Get orders
                const ordersRes = await API.get('/admin/all');
                const orders = ordersRes.data.orders || [];

                // Get customers
                const customersRes = await API.get('/admin/customers');
                const customers = customersRes.data.customers || [];

                // Calculate stats
                const successfulOrders = orders.filter(o => o.payment_status === 'successful');
                const totalRevenue = successfulOrders.reduce((sum, o) => sum + o.total_amount, 0);

                setStats({
                    totalRevenue: totalRevenue,
                    totalOrders: orders.length,
                    totalCustomers: customers.length,
                    visitors: visitorData.month_visits || 0
                });

                setChartData({
                    revenue: visitorData.daily_visits || [],
                    orders: [
                        { name: 'Processing', value: orders.filter(o => o.order_status === 'processing').length },
                        { name: 'Shipped', value: orders.filter(o => o.order_status === 'shipped').length },
                        { name: 'Delivered', value: orders.filter(o => o.order_status === 'delivered').length },
                        { name: 'Cancelled', value: orders.filter(o => o.order_status === 'cancelled').length }
                    ],
                    visits: visitorData.daily_visits || []
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching stats:', error);
                // Show fallback data when API fails
                setStats({
                    totalRevenue: 0,
                    totalOrders: 0,
                    totalCustomers: 0,
                    visitors: 0
                });

                setChartData({
                    revenue: [],
                    orders: [
                        { name: 'Processing', value: 0 },
                        { name: 'Shipped', value: 0 },
                        { name: 'Delivered', value: 0 },
                        { name: 'Cancelled', value: 0 }
                    ],
                    visits: []
                });
                
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ icon: Icon, title, value, change, color }) => (
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
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

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
                    value={stats.totalRevenue}
                    change={12.5}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Package}
                    title="Total Orders"
                    value={stats.totalOrders}
                    change={8.2}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={Users}
                    title="Total Customers"
                    value={stats.totalCustomers}
                    change={15.3}
                    color="bg-green-500"
                />
                <StatCard
                    icon={Eye}
                    title="Site Visitors"
                    value={stats.visitors}
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
        </div>
    );
};

export default AdminOverview;
