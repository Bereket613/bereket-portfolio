import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../api';
import Button from '../../../components/ui/Button';
import Markdown from '../../../components/blog/Markdown';

const emptyPost = {
    title: '', slug: '', excerpt: '', content: '', cover_image_url: '',
    category: '', tags: '', status: 'draft'
};

const STATUS_STYLES = {
    published: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    draft: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    archived: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const ManageBlogPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('all');
    const [showEditor, setShowEditor] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyPost);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null); // post awaiting delete confirmation

    useEffect(() => {
        if (showEditor) return;
        const fetchPosts = async () => {
            try {
                const params = tab !== 'all' ? { status: tab } : {};
                const res = await api.get('/api/admin/blog', { params });
                setPosts(res.data);
            } catch (err) {
                toast.error('Failed to load posts');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [tab, showEditor]);

    const openNew = () => {
        setEditingId(null);
        setForm(emptyPost);
        setShowPreview(false);
        setShowEditor(true);
    };

    const openEdit = (post) => {
        setEditingId(post.id);
        setForm({
            title: post.title, slug: post.slug, excerpt: post.excerpt || '',
            content: post.content || '', cover_image_url: post.cover_image_url || '',
            category: post.category || '', tags: Array.isArray(post.tags) ? post.tags.join(', ') : '',
            status: post.status
        });
        setShowPreview(false);
        setShowEditor(true);
    };

    const handleSave = async (status) => {
        if (!form.title.trim() || !form.content.trim()) {
            toast.error('Title and content are required');
            return;
        }
        setSaving(true);
        const payload = {
            ...form,
            tags: form.tags ? form.tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean) : [],
            status
        };
        try {
            if (editingId) {
                await api.put(`/api/blog/${editingId}`, payload);
                toast.success(status === 'published' ? 'Post published' : 'Draft saved');
            } else {
                await api.post('/api/blog', payload);
                toast.success(status === 'published' ? 'Post published' : 'Draft saved');
            }
            setShowEditor(false);
            setTab(status === 'published' ? 'published' : tab === 'all' ? 'all' : tab);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save post');
        } finally {
            setSaving(false);
        }
    };

    const togglePublish = async (post) => {
        const nextStatus = post.status === 'published' ? 'draft' : 'published';
        try {
            await api.put(`/api/blog/${post.id}`, {
                title: post.title,
                excerpt: post.excerpt,
                content: post.content,
                cover_image_url: post.cover_image_url,
                category: post.category,
                tags: post.tags,
                status: nextStatus
            });
            toast.success(nextStatus === 'published' ? 'Post published' : 'Post unpublished');
        } catch (err) {
            toast.error('Failed to update post status');
        }
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/blog/${deleting.id}`);
            toast.success('Post deleted');
            setDeleting(null);
        } catch (err) {
            toast.error('Failed to delete post');
        }
    };

    const tabs = [
        { key: 'all', label: 'All Posts' },
        { key: 'published', label: 'Published' },
        { key: 'draft', label: 'Drafts' },
    ];

    const inputClasses = "w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent text-sm";

    /* ---------- Editor ---------- */
    if (showEditor) {
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{editingId ? 'Edit Post' : 'New Blog Post'}</h2>
                    <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[form.status] || STATUS_STYLES.draft}`}>
                            {form.status}
                        </span>
                        <Button variant="ghost" onClick={() => setShowEditor(false)}>Cancel</Button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                className={inputClasses} placeholder="What I learned building..." required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug <span className="text-gray-400">(auto-generated from title)</span></label>
                            <input type="text" value={form.slug} disabled className={`${inputClasses} opacity-60`} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <input type="text" list="blog-categories" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                className={inputClasses} placeholder="e.g. Machine Learning" />
                            <datalist id="blog-categories">
                                {['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Big Data', 'RAG', 'Agentic AI', 'Privacy-Preserving AI', 'AI Engineering', 'Research', 'Project Updates', 'Tutorials'].map(c => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags <span className="text-gray-400">(comma-separated)</span></label>
                            <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                                className={inputClasses} placeholder="Python, PyTorch, NLP" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt</label>
                        <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows="2"
                            className={inputClasses} placeholder="One or two sentences shown on cards and social previews" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover image URL (optional)</label>
                        <input type="text" value={form.cover_image_url} onChange={e => setForm({ ...form, cover_image_url: e.target.value })}
                            className={inputClasses} placeholder="/uploads/... or https://..." />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown) *</label>
                            <button type="button" onClick={() => setShowPreview(!showPreview)}
                                className="text-xs font-medium text-accent dark:text-teal-400 hover:underline">
                                <i className={`fas ${showPreview ? 'fa-edit' : 'fa-eye'} mr-1`}></i>
                                {showPreview ? 'Edit' : 'Preview'}
                            </button>
                        </div>
                        {showPreview ? (
                            <div className="min-h-[420px] max-h-[70vh] overflow-y-auto border border-gray-200 dark:border-gray-600 rounded-lg p-5 bg-gray-50 dark:bg-gray-900">
                                <Markdown content={form.content} />
                            </div>
                        ) : (
                            <textarea
                                value={form.content}
                                onChange={e => setForm({ ...form, content: e.target.value })}
                                rows="18"
                                className={`${inputClasses} font-mono text-[13px] leading-relaxed`}
                                placeholder={'# Experiment\n\nToday I tested...\n\n## What I changed\n\n## Results\n\n```python\n# code blocks supported\n```\n\n## What I learned'}
                            />
                        )}
                        <p className="text-xs text-gray-400 mt-1">Markdown supported: headings, lists, links, code blocks with syntax highlighting, quotes, tables, images.</p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button variant="secondary" onClick={() => handleSave('draft')} disabled={saving}>
                            <i className="fas fa-floppy-disk"></i> Save Draft
                        </Button>
                        <Button variant="primary" onClick={() => handleSave('published')} disabled={saving}>
                            <i className="fas fa-paper-plane"></i> Publish
                        </Button>
                        {editingId && form.status === 'published' && (
                            <Button variant="ghost" onClick={() => handleSave('draft')} disabled={saving}>
                                Unpublish
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- List ---------- */
    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Blog</h2>
                <Button onClick={openNew} variant="primary"><i className="fas fa-plus mr-2"></i>New Post</Button>
            </div>

            <div className="flex gap-2 mb-5">
                {tabs.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            tab === t.key
                                ? 'bg-accent text-white'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-accent'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center h-32 items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                    {tab === 'draft' ? 'No drafts saved.' : tab === 'published' ? 'No published posts yet.' : 'No posts yet. Click "New Post" to start your engineering journal.'}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{post.title}</div>
                                        <div className="font-mono text-xs text-gray-400">/{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_STYLES[post.status]}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{post.category || '—'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{post.published_at ? formatDate(post.published_at) : '—'}</td>
                                    <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                                        <Button variant="ghost" onClick={() => openEdit(post)} title="Edit"><i className="fas fa-edit"></i></Button>
                                        <Button variant="ghost" onClick={() => togglePublish(post)} title={post.status === 'published' ? 'Unpublish' : 'Publish'}>
                                            <i className={`fas ${post.status === 'published' ? 'fa-eye-slash' : 'fa-globe'}`}></i>
                                        </Button>
                                        <Button variant="danger" onClick={() => setDeleting(post)} title="Delete"><i className="fas fa-trash"></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Delete confirmation */}
            {deleting && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirm delete">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete this post?</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            "{deleting.title}" will be permanently deleted. This cannot be undone.
                        </p>
                        <div className="flex gap-3 mt-6 justify-end">
                            <Button variant="ghost" onClick={() => setDeleting(null)}>Cancel</Button>
                            <Button variant="danger" onClick={confirmDelete}><i className="fas fa-trash mr-2"></i>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBlogPosts;
