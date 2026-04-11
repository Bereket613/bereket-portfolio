import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';

const ManageMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const res = await api.get('/api/messages');
            setMessages(res.data);
        } catch (err) {
            toast.error("Failed to load messages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/api/messages/${id}/read`);
            setMessages(messages.map(m => m.id === id ? { ...m, is_read: true } : m));
            toast.success("Message marked as read");
        } catch (err) {
            toast.error("Failed to update message");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            await api.delete(`/api/messages/${id}`);
            setMessages(messages.filter(m => m.id !== id));
            toast.success("Message deleted");
        } catch (err) {
            toast.error("Failed to delete message");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Messages</h2>
            
            {loading ? (
                <div className="flex justify-center h-32 items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : messages.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                    No messages received yet.
                </div>
            ) : (
                <div className="space-y-4">
                    {messages.map(msg => (
                        <div key={msg.id} className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border transition-colors ${msg.is_read ? 'border-gray-200 dark:border-gray-700' : 'border-accent dark:border-accent'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {msg.name} 
                                        {!msg.is_read && <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">New</span>}
                                    </h3>
                                    <a href={`mailto:${msg.email}`} className="text-sm text-accent hover:underline">{msg.email}</a>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString()}
                                </div>
                            </div>
                            
                            {msg.subject && <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Subject: {msg.subject}</h4>}
                            
                            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                                {msg.message}
                            </div>
                            
                            <div className="flex gap-3 justify-end">
                                {!msg.is_read && (
                                    <Button variant="secondary" onClick={() => handleMarkAsRead(msg.id)}>
                                        Mark as Read
                                    </Button>
                                )}
                                <Button variant="danger" onClick={() => handleDelete(msg.id)}>
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageMessages;
