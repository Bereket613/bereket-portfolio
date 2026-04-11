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
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[100px] pointer-events-none"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark mb-6 relative z-10">Thoughts & Ideas</h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 relative z-10">
            A peak into my latest thoughts, learnings, and experiences in data science and web development.
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
          <div className="text-center text-slate-500 py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-sm">
            No thoughts posted yet.
          </div>
        ) : (
          <div className="space-y-8">
            {blogs.map((blog, idx) => (
              <motion.article 
                key={blog.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 shadow-lg shadow-accent/5 border border-white/50 dark:border-slate-700/50 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <header className="mb-4 relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent group-hover:to-accentDark transition-all duration-300">{blog.title}</h3>
                  <div className="text-sm text-slate-500 mt-2 font-medium">
                    <i className="far fa-calendar-alt mr-2 text-accent"></i>
                    {new Date(blog.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </header>
                <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed relative z-10 text-lg">
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
