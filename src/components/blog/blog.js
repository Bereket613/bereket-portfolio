import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../../api';

const PAGE_SIZE = 6;

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/api/blog-categories')
      .then(res => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit: PAGE_SIZE };
        if (search) params.search = search;
        if (category) params.category = category;
        const res = await api.get('/api/blog', { params });
        setPosts(res.data.posts);
        setTotal(res.data.total);
      } catch (err) {
        console.error('Error fetching blog posts:', err);
        setError('Unable to load articles. The backend may be offline — please try again later.');
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchPosts, search ? 400 : 0); // debounce search
    return () => clearTimeout(t);
  }, [page, search, category]);

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <section className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Engineering Notes</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
            Notes from building, researching, and experimenting with AI systems — experiments, progress,
            and lessons learned.
          </p>
        </motion.div>

        {/* Search + category filter */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" aria-hidden="true"></i>
            <input
              type="search"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search technical articles..."
              aria-label="Search articles"
              className="block w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-accent focus:border-transparent focus:outline-none"
            />
          </div>
          {categories.length > 0 && (
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
              aria-label="Filter by category"
              className="px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent focus:outline-none"
            >
              <option value="">All categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40" role="status" aria-label="Loading articles">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-accent"></div>
          </div>
        ) : error ? (
          <div className="mt-10 text-center">
            <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-900 inline-flex items-center gap-2">
              <i className="fas fa-triangle-exclamation"></i> {error}
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="mt-12 text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
            <i className="fas fa-feather text-2xl text-slate-300 dark:text-slate-600" aria-hidden="true"></i>
            <p className="text-slate-500 dark:text-slate-400 mt-3">
              {search || category ? 'No articles match your search.' : 'No published articles yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
              {posts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="py-7 group"
                >
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                    {post.category && (
                      <span className="font-mono text-xs uppercase tracking-wider text-accent dark:text-teal-400">
                        {post.category}
                      </span>
                    )}
                    <span className="font-mono text-xs text-slate-400">
                      {post.published_at ? formatDate(post.published_at) : ''} · {post.reading_time || 1} min read
                    </span>
                  </div>

                  <h2 className="text-xl font-semibold">
                    <Link to={`/blog/${post.slug}`} className="text-slate-900 dark:text-white group-hover:text-accent dark:group-hover:text-teal-400 transition-colors">
                      {post.title}
                    </Link>
                  </h2>

                  {post.excerpt && (
                    <p className="text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {post.tags.map((tag, i) => (
                        <span key={i} className="font-mono text-xs text-slate-500 dark:text-slate-500">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-accent dark:text-teal-400 mt-3 hover:gap-2.5 transition-all"
                    aria-label={`Read article: ${post.title}`}
                  >
                    Read article <i className="fas fa-arrow-right text-xs"></i>
                  </Link>
                </motion.article>
              ))}
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <nav className="flex justify-center items-center gap-2 mt-10" aria-label="Blog pagination">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 enabled:hover:border-accent enabled:hover:text-accent dark:enabled:hover:border-teal-400 dark:enabled:hover:text-teal-400 transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    aria-current={p === page ? 'page' : undefined}
                    className={`w-9 h-9 text-sm rounded-lg border transition-colors ${
                      p === page
                        ? 'bg-accent text-white border-accent'
                        : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-accent hover:text-accent dark:hover:border-teal-400 dark:hover:text-teal-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(pages, p + 1))}
                  disabled={page === pages}
                  className="px-4 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-40 enabled:hover:border-accent enabled:hover:text-accent dark:enabled:hover:border-teal-400 dark:enabled:hover:text-teal-400 transition-colors"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Blog;
