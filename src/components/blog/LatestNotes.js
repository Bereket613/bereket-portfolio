import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const LatestNotes = () => {
  const [posts, setPosts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    api.get('/api/blog', { params: { page: 1, limit: 3 } })
      .then(res => setPosts(res.data.posts || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || posts.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-12 bg-slate-100/60 dark:bg-slate-900/60">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex items-end justify-between gap-4"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Latest Notes</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">Recent writing from my engineering journal.</p>
          </div>
          <Link to="/blog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-accent dark:text-teal-400 hover:gap-2.5 transition-all flex-shrink-0">
            View All Notes <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800 hover:border-accent/50 dark:hover:border-teal-400/50 transition-colors flex flex-col"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                {post.category && (
                  <span className="font-mono text-xs uppercase tracking-wider text-accent dark:text-teal-400">{post.category}</span>
                )}
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white leading-snug">
                <Link to={`/blog/${post.slug}`} className="hover:text-accent dark:hover:text-teal-400 transition-colors">
                  {post.title}
                </Link>
              </h3>
              {post.excerpt && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 flex-grow">{post.excerpt}</p>
              )}
              <p className="font-mono text-xs text-slate-400 mt-4">
                {post.published_at ? formatDate(post.published_at) : ''} · {post.reading_time || 1} min read
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 sm:hidden text-center">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent dark:text-teal-400">
            View All Notes <i className="fas fa-arrow-right text-xs"></i>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestNotes;
