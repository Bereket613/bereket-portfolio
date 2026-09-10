import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { BarChart, DonutChart } from './Charts';

const DashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/api/analytics');
                setStats(res.data);
            } catch (err) {
                console.error("Failed to fetch analytics:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const shortDay = (dateStr) => new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'short' });

    const statCards = stats ? [
        { title: 'Total Visitors', value: stats.totalVisitors, icon: 'fas fa-users', color: 'bg-indigo-500' },
        { title: 'Total Projects', value: stats.totalProjects, icon: 'fas fa-project-diagram', color: 'bg-blue-500' },
        { title: 'Total Messages', value: stats.totalMessages, icon: 'fas fa-envelope', color: 'bg-green-500' },
        { title: 'Unread Messages', value: stats.unreadMessages, icon: 'fas fa-bell', color: 'bg-red-500' }
    ] : [];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h2>

            {loading ? (
                <div className="flex justify-center h-32 items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map((card, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                                <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mr-4 flex-shrink-0`}>
                                    <i className={card.icon}></i>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value ?? 0}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <BarChart
                                label="Visits — Last 7 Days"
                                color="#4f46e5"
                                data={(stats?.visitsLast7Days || []).map(d => ({ label: shortDay(d.date), value: d.visits }))}
                            />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <BarChart
                                label="Messages — Last 7 Days"
                                color="#10b981"
                                data={(stats?.messagesLast7Days || []).map(d => ({ label: shortDay(d.date), value: d.messages }))}
                            />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <DonutChart
                                label="Projects by Category"
                                data={(stats?.projectsByCategory || []).map(d => ({ label: d.category, value: d.count }))}
                            />
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Welcome to Admin Portal</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Use the sidebar navigation to manage your portfolio content. Here you can add, edit, or delete Projects, Experience Timeline entries, upload your CV, and read user messages from the Contact form.
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardOverview;
