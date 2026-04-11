import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';

const ManageProfile = () => {
    const [profile, setProfile] = useState({
        name: '', title: '', about: '', logo_url: '', email: '', github: '', linkedin: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/api/profile');
            if (res.data && Object.keys(res.data).length > 0) {
                setProfile(res.data);
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load profile');
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put('/api/profile', profile);
            toast.success('CV Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    if (loading) return <div className="text-gray-500">Loading profile data...</div>;

    return (
        <div>
            <h2 className="text-2xl font-bold dark:text-white mb-6">CV & Profile Settings</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 mb-6">This information will be used to dynamically generate your beautiful printable Resume/CV.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                            <input type="text" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none" placeholder="Bereket Getaw" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Job Title</label>
                            <input type="text" value={profile.title || ''} onChange={e => setProfile({...profile, title: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none" placeholder="AI Engineer / Data Scientist" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                            <input type="email" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none" placeholder="email@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Logo URL</label>
                            <input type="text" value={profile.logo_url || ''} onChange={e => setProfile({...profile, logo_url: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none" placeholder="/logo.png or https://..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
                            <input type="text" value={profile.github || ''} onChange={e => setProfile({...profile, github: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none" placeholder="https://github.com/..." />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">LinkedIn URL</label>
                            <input type="text" value={profile.linkedin || ''} onChange={e => setProfile({...profile, linkedin: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none" placeholder="https://linkedin.com/in/..." />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About / Bio</label>
                        <textarea rows="5" value={profile.about || ''} onChange={e => setProfile({...profile, about: e.target.value})} className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-accent outline-none" placeholder="Write a short professional summary..."></textarea>
                    </div>
                    <button type="submit" className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accentDark transition mt-4 shadow-lg shadow-accent/30 font-medium">
                        Save CV Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ManageProfile;
