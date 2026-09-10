import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/api/blogs');
        setBlogs(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-24 transition-colors duration-300">
      <section className="max-w-4xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Blog</h2>
          <p className="text-slate-600 dark:text-slate-400">
            A peek into my latest thoughts, learnings, and experiences in data science and web development.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 bg-red-100/50 p-4 rounded-xl border border-red-200">
            Failed to load thoughts: {error}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            No posts yet. Check back later.
          </div>
        ) : (
          <div className="space-y-6">
            {blogs.map((blog, idx) => (
              <motion.article
                key={blog.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800"
              >
                <header className="mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{blog.title}</h3>
                  <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    <i className="far fa-calendar-alt mr-2 text-accent dark:text-teal-400"></i>
                    {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </header>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {blog.content}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Blog;
