import React, { useState, useEffect } from 'react';
import api from '../../../api';

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalMessages: 0,
        totalExperiences: 0,
        unreadMessages: 0
    });
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

    const statCards = [
        { title: 'Total Projects', value: stats.totalProjects, icon: 'fas fa-project-diagram', color: 'bg-blue-500' },
        { title: 'Total Experiences', value: stats.totalExperiences, icon: 'fas fa-briefcase', color: 'bg-purple-500' },
        { title: 'Total Messages', value: stats.totalMessages, icon: 'fas fa-envelope', color: 'bg-green-500' },
        { title: 'Unread Messages', value: stats.unreadMessages, icon: 'fas fa-bell', color: 'bg-red-500' }
    ];

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Dashboard Overview</h2>
            
            {loading ? (
                <div className="flex justify-center h-32 items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center">
                            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mr-4 flex-shrink-0`}>
                                <i className={card.icon}></i>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Welcome to Admin Portal</h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Use the sidebar navigation to manage your portfolio content. Here you can add, edit, or delete Projects, Experience Timeline entries, and read user messages from the Contact form.
                </p>
            </div>
        </div>
    );
};

export default DashboardOverview;
