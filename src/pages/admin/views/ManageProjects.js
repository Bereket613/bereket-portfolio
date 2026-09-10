import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';

const emptyProject = { title: '', description: '', image_url: '', tech_stack: '', live_demo_url: '', github_url: '', category: '' };

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyProject);

    const fetchProjects = async () => {
        try {
            const res = await api.get('/api/projects');
            setProjects(res.data);
        } catch (err) {
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptyProject);
        setShowModal(true);
    };

    const openEdit = (project) => {
        setEditing(project.id);
        setForm({ 
            ...project, 
            tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack || '' 
        });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            tech_stack: form.tech_stack ? form.tech_stack.split(',').map(s => s.trim()) : []
        };
        try {
            if (editing) {
                await api.put(`/api/projects/${editing}`, payload);
                toast.success("Project updated");
            } else {
                await api.post('/api/projects', payload);
                toast.success("Project created");
            }
            setShowModal(false);
            fetchProjects();
        } catch (err) {
            toast.error("Failed to save project");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this project?")) return;
        try {
            await api.delete(`/api/projects/${id}`);
            setProjects(projects.filter(p => p.id !== id));
            toast.success("Project deleted");
        } catch (err) {
            toast.error("Failed to delete project");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await api.post('/api/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setForm(prev => ({ ...prev, image_url: res.data.url }));
            toast.success("Image uploaded");
        } catch (err) {
            toast.error(err.response?.data?.message || "Image upload failed");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Projects</h2>
                <Button onClick={openAdd} variant="primary"><i className="fas fa-plus mr-2"></i>Add Project</Button>
            </div>

            {loading ? (
                <div className="flex justify-center h-32 items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {projects.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400">No projects yet. Add your first one!</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {projects.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{p.title}</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{p.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent">{p.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <Button variant="ghost" onClick={() => openEdit(p)}><i className="fas fa-edit"></i></Button>
                                            <Button variant="danger" onClick={() => handleDelete(p.id)}><i className="fas fa-trash"></i></Button>
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
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{editing ? 'Edit Project' : 'Add Project'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            {[
                                { label: 'Title', name: 'title', required: true },
                                { label: 'Category', name: 'category' },
                                { label: 'Image URL', name: 'image_url' },
                                { label: 'Live Demo URL', name: 'live_demo_url' },
                                { label: 'GitHub URL', name: 'github_url' },
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
                                    name="description"
                                    value={form.description || ''}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows="3"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Image</label>
                                <div className="flex items-center gap-4">
                                    {form.image_url && (
                                        <img src={form.image_url} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600" />
                                    )}
                                    <label className="cursor-pointer flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg py-3 text-sm text-gray-500 dark:text-gray-400 hover:border-accent hover:text-accent transition-colors">
                                        <i className="fas fa-cloud-upload-alt"></i> Upload image
                                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml" onChange={handleImageUpload} className="hidden" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Max 5 MB — jpeg, png, webp, gif, svg</p>
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

export default ManageProjects;
