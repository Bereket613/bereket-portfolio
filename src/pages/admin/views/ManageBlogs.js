import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { toast } from 'react-toastify';

const ManageBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/api/blogs');
      setBlogs(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load blogs');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBlog.id) {
        await api.put(`/api/blogs/${currentBlog.id}`, currentBlog);
        toast.success('Blog updated successfully');
      } else {
        await api.post('/api/blogs', currentBlog);
        toast.success('Blog created successfully');
      }
      setIsEditing(false);
      setCurrentBlog({ title: '', content: '' });
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to save blog');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await api.delete(`/api/blogs/${id}`);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        toast.error('Failed to delete blog');
      }
    }
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Manage Blogs</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accentDark transition"
          >
            <i className="fas fa-plus mr-2"></i> Add Blog
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 dark:text-white">{currentBlog.id ? 'Edit Blog' : 'New Blog'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                type="text"
                value={currentBlog.title}
                onChange={(e) => setCurrentBlog({...currentBlog, title: e.target.value})}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-accent focus:border-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content</label>
              <textarea
                value={currentBlog.content}
                onChange={(e) => setCurrentBlog({...currentBlog, content: e.target.value})}
                required
                rows="10"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 dark:text-white focus:ring-accent focus:border-accent"
              ></textarea>
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-accentDark transition">
                {currentBlog.id ? 'Update' : 'Publish'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setCurrentBlog({ title: '', content: '' });
                }}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {blog.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEdit(blog)} className="text-blue-500 hover:text-blue-700 mr-4">Edit</button>
                    <button onClick={() => handleDelete(blog.id)} className="text-red-500 hover:text-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBlogs;
