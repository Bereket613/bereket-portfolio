import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';

const emptyExp = { role: '', organization: '', duration: '', description: '', key_achievements: '', tech_stack: '' };

const ManageExperiences = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyExp);

    const fetchExperiences = async () => {
        try {
            const res = await api.get('/api/experiences');
            setExperiences(res.data);
        } catch (err) {
            toast.error("Failed to load experiences");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchExperiences(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyExp);
        setShowModal(true);
    };

    const openEdit = (exp) => {
        setEditing(exp.id);
        setForm({
            ...exp,
            key_achievements: Array.isArray(exp.key_achievements) ? exp.key_achievements.join('\n') : exp.key_achievements || '',
            tech_stack: Array.isArray(exp.tech_stack) ? exp.tech_stack.join(', ') : exp.tech_stack || '',
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            key_achievements: form.key_achievements ? form.key_achievements.split('\n').map(s => s.trim()).filter(Boolean) : [],
            tech_stack: form.tech_stack ? form.tech_stack.split(',').map(s => s.trim()) : [],
        };
        try {
            if (editing) {
                await api.put(`/api/experiences/${editing}`, payload);
                toast.success("Experience updated");
            } else {
                await api.post('/api/experiences', payload);
                toast.success("Experience added");
            }
            setShowModal(false);
            fetchExperiences();
        } catch (err) {
            toast.error("Failed to save experience");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this experience?")) return;
        try {
            await api.delete(`/api/experiences/${id}`);
            setExperiences(experiences.filter(e => e.id !== id));
            toast.success("Experience deleted");
        } catch (err) {
            toast.error("Failed to delete experience");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Experience</h2>
                <Button onClick={openAdd} variant="primary"><i className="fas fa-plus mr-2"></i>Add Experience</Button>
            </div>

            {loading ? (
                <div className="flex justify-center h-32 items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {experiences.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">No experience entries yet. Add your first one!</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Organization</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {experiences.map(exp => (
                                    <tr key={exp.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{exp.role}</td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{exp.organization}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{exp.duration}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button variant="ghost" onClick={() => openEdit(exp)}><i className="fas fa-edit"></i></Button>
                                            <Button variant="danger" onClick={() => handleDelete(exp.id)}><i className="fas fa-trash"></i></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{editing ? 'Edit Experience' : 'Add Experience'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {[
                                { label: 'Role / Job Title', name: 'role', required: true },
                                { label: 'Organization', name: 'organization', required: true },
                                { label: 'Duration (e.g. 2023 – Present)', name: 'duration' },
                                { label: 'Tech Stack (comma-separated)', name: 'tech_stack' },
                            ].map(({ label, name, required }) => (
                                <div key={name}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
                                    <input
                                        type="text"
                                        name={name}
                                        value={form[name] || ''}
                                        onChange={e => setForm({ ...form, [name]: e.target.value })}
                                        required={required}
                                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                                    />
                                </div>
                            ))}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={form.description || ''}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Key Achievements (one per line)</label>
                                <textarea
                                    value={form.key_achievements || ''}
                                    onChange={e => setForm({ ...form, key_achievements: e.target.value })}
                                    rows="4"
                                    placeholder="Led a team of 5 engineers&#10;Built scalable REST APIs&#10;..."
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                                ></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" variant="primary" className="flex-1">Save</Button>
                                <Button type="button" variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageExperiences;
