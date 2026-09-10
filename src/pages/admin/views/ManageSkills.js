import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';
import Button from '../../../components/ui/Button';
import { defaultSkills } from '../../../data/portfolioData';

const emptySkill = { category: '', name: '', description: '' };

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptySkill);

    const fetchSkills = async () => {
        try {
            const res = await api.get('/api/skills');
            setSkills(res.data);
        } catch (err) {
            toast.error('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSkills(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm(emptySkill);
        setShowModal(true);
    };

    const openEdit = (skill) => {
        setEditing(skill.id);
        setForm({ category: skill.category, name: skill.name, description: skill.description || '' });
        setShowModal(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await api.put(`/api/skills/${editing}`, form);
                toast.success('Skill updated');
            } else {
                await api.post('/api/skills', form);
                toast.success('Skill added');
            }
            setShowModal(false);
            fetchSkills();
        } catch (err) {
            toast.error('Failed to save skill');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this skill?')) return;
        try {
            await api.delete(`/api/skills/${id}`);
            setSkills(skills.filter(s => s.id !== id));
            toast.success('Skill deleted');
        } catch (err) {
            toast.error('Failed to delete skill');
        }
    };

    // Group for display
    const grouped = skills.reduce((acc, s) => {
        if (!acc[s.category]) acc[s.category] = [];
        acc[s.category].push(s);
        return acc;
    }, {});

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Skills</h2>
                <Button onClick={openAdd} variant="primary"><i className="fas fa-plus mr-2"></i>Add Skill</Button>
            </div>

            {loading ? (
                <div className="flex justify-center h-32 items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : skills.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                    No skills in the database yet. Add skills, or restart the backend to seed the default set.
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(grouped).map(([category, items]) => (
                        <div key={category} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                {category}
                            </div>
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {items.map(s => (
                                        <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                            <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{s.name}</td>
                                            <td className="px-6 py-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{s.description}</td>
                                            <td className="px-6 py-3 text-right space-x-2 whitespace-nowrap">
                                                <Button variant="ghost" onClick={() => openEdit(s)}><i className="fas fa-edit"></i></Button>
                                                <Button variant="danger" onClick={() => handleDelete(s.id)}><i className="fas fa-trash"></i></Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{editing ? 'Edit Skill' : 'Add Skill'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <input
                                    type="text"
                                    list="skill-categories"
                                    value={form.category}
                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                                    placeholder="e.g. Machine Learning"
                                />
                                <datalist id="skill-categories">
                                    {defaultSkills.map(g => <option key={g.category} value={g.category} />)}
                                    {Object.keys(grouped).map(c => <option key={c} value={c} />)}
                                </datalist>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skill name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                                    placeholder="e.g. PyTorch"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category description (optional)</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    rows="2"
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent"
                                    placeholder="Short description shown with this skill's category"
                                ></textarea>
                            </div>
                            <div className="flex gap-4 pt-2">
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

export default ManageSkills;
