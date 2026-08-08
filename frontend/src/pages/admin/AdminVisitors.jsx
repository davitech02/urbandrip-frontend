import { useState, useEffect } from 'react';
import API from '../../services/api';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, Monitor, Smartphone } from 'lucide-react';

const AdminVisitors = () => {
    const [stats, setStats] = useState({
        total_visits: 0,
        month_visits: 0,
        unique_visitors: 0
    });
    const [recentVisits, setRecentVisits] = useState([]);
    const [chartData, setChartData] = useState({
        daily: [],
        devices: [],
        pages: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            API.get('/api/admin/visitors/stats'),
            API.get('/api/admin/visitors/recent')
        ]).then(([statsRes, recentRes]) => {
            if (cancelled) return;
            const statsData = statsRes.data;
            setStats({
                total_visits: statsData.total_visits || 0,
                month_visits: statsData.month_visits || 0,
                unique_visitors: statsData.unique_visitors || 0
            });
            setRecentVisits(recentRes.data.recent || recentRes.data.visits || []);
            const deviceBreakdown = statsData.device_breakdown || {};
            setChartData({
                daily: (statsData.daily_visits || []).map(d => ({
                    date: d.date,
                    visits: d.visits
                })),
                devices: Object.entries(deviceBreakdown).map(([name, value]) => ({
                    name: name.charAt(0).toUpperCase() + name.slice(1),
                    value
                })),
                pages: (statsData.top_pages || []).slice(0, 5).map(item => ({
                    name: (item.page || item.name || '').substring(0, 20) + ((item.page || item.name || '').length > 20 ? '...' : ''),
                    visits: item.visits || item.value || 0
                }))
            });
            setLoading(false);
        }).catch(error => {
            if (cancelled) return;
            console.error('Error fetching visitor data:', error);
            setStats({ total_visits: 0, month_visits: 0, unique_visitors: 0 });
            setRecentVisits([]);
            setChartData({ daily: [], devices: [], pages: [] });
            setLoading(false);
        });
        return () => { cancelled = true; };
    }, []);

    if (loading) return <div className="text-center py-20">Loading visitor data...</div>;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    icon={Eye}
                    title="Total Visits"
                    value={stats.total_visits}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={Eye}
                    title="This Month"
                    value={stats.month_visits}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={Eye}
                    title="Unique Visitors"
                    value={stats.unique_visitors}
                    color="bg-green-500"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Visits */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                        Daily Visits
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData.daily}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="date" stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip />
                            <Line type="monotone" dataKey="visits" stroke="#000" dot={{ fill: '#000' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Pages */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                        Top Pages
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData.pages}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} stroke="#999" />
                            <YAxis stroke="#999" />
                            <Tooltip />
                            <Bar dataKey="visits" fill="#000" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900 mb-4">
                    Device Breakdown
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {chartData.devices.map((device, idx) => (
                        <div key={idx} className="text-center p-4 rounded-lg bg-gray-50">
                            <div className="flex justify-center mb-2">
                                {device.name === 'Mobile' ? (
                                    <Smartphone className="w-8 h-8 text-blue-600" />
                                ) : (
                                    <Monitor className="w-8 h-8 text-gray-600" />
                                )}
                            </div>
                            <p className="font-['Inter'] text-sm font-medium text-gray-900">{device.name}</p>
                            <p className="font-['Playfair_Display'] text-2xl font-bold text-gray-900">
                                {device.value.toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Visits */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-gray-900">
                        Recent Visits
                    </h3>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Page</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Device</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Browser</th>
                            <th className="px-6 py-3 text-left font-['Inter'] text-sm font-bold text-gray-900">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {recentVisits.slice(0, 20).map((visit, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-900">{visit.page_url}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center gap-2">
                                        {visit.device_type === 'mobile' ? (
                                            <Smartphone className="w-4 h-4 text-blue-600" />
                                        ) : (
                                            <Monitor className="w-4 h-4 text-gray-600" />
                                        )}
                                        <span className="font-['Inter'] text-sm text-gray-600 capitalize">
                                            {visit.device_type}
                                        </span>
                                    </span>
                                </td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">{visit.browser}</td>
                                <td className="px-6 py-4 font-['Inter'] text-sm text-gray-600">
                                    {new Date(visit.timestamp).toLocaleTimeString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => {
    const IconCmp = icon;
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-['Inter'] text-gray-600 text-sm mb-1">{title}</p>
                    <p className="font-['Playfair_Display'] text-3xl font-bold text-gray-900">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <IconCmp className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );
};

export default AdminVisitors;
