import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api, { absoluteUrl } from '../../api';
import Markdown from './Markdown';

const SITE_BASE = 'https://Bereket613.github.io/bereket-portfolio/';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

// Set per-article document metadata (SEO / Open Graph / Twitter)
const useDocumentMeta = ({ title, description, image }) => {
  useEffect(() => {
    if (!title) return;
    const prev = { title: document.title, description: document.querySelector('meta[name="description"]')?.content };

    document.title = `${title} | Bereket Getaw`;
    const setMeta = (name, value, attr = 'name') => {
      let el = document.head.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };
    setMeta('description', description || title);
    setMeta('og:title', `${title} | Bereket Getaw`, 'property');
    setMeta('og:description', description || title, 'property');
    setMeta('og:type', 'article', 'property');
    setMeta('og:url', window.location.href, 'property');
    setMeta('twitter:card', 'summary');
    setMeta('twitter:title', `${title} | Bereket Getaw`);
    setMeta('twitter:description', description || title);
    if (image) setMeta('og:image', image.startsWith('http') ? image : SITE_BASE.replace(/\/$/, '') + image, 'property');

    return () => {
      document.title = prev.title;
      const desc = document.querySelector('meta[name="description"]');
      if (desc && prev.description) desc.setAttribute('content', prev.description);
    };
  }, [title, description, image]);
};

const BlogArticle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [adjacent, setAdjacent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useDocumentMeta(post ? { title: post.title, description: post.excerpt, image: post.cover_image_url } : {});

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      setPost(null);
      try {
        const [postRes, adjRes] = await Promise.all([
          api.get(`/api/blog/${slug}`),
          api.get(`/api/blog/${slug}/adjacent`).catch(() => ({ data: { prev: null, next: null } }))
        ]);
        setPost(postRes.data);
        setAdjacent(adjRes.data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError(err.response?.status === 404
          ? 'This article does not exist or has not been published.'
          : 'Unable to load the article. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy the link');
    }
  };

  const loadingView = (
    <div className="flex justify-center items-center h-64" role="status" aria-label="Loading article">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-accent"></div>
    </div>
  );

  const errorView = (
    <div className="pt-40 pb-32 text-center">
      <p className="text-slate-600 dark:text-slate-400 text-lg">{error}</p>
      <Link to="/blog" className="inline-block mt-6 text-sm font-medium text-accent dark:text-teal-400 hover:underline">
        ← Back to all notes
      </Link>
    </div>
  );

  return (
    <div className="pt-28 pb-20 px-6 md:px-12">
      <ToastContainer position="bottom-right" />
      <main className="max-w-3xl mx-auto">
        {loading ? loadingView : error ? errorView : post && (
          <motion.article
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <header>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                {post.category && (
                  <span className="font-mono text-xs uppercase tracking-wider text-accent dark:text-teal-400">
                    {post.category}
                  </span>
                )}
                <span className="font-mono text-xs text-slate-400">
                  {post.published_at ? formatDate(post.published_at) : 'Unpublished'} · {post.reading_time || 1} min read
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-4 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="font-mono text-xs text-slate-500 dark:text-slate-500">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Share */}
              <div className="flex items-center gap-3 mt-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Share</span>
                <button onClick={copyLink} className="text-slate-400 hover:text-accent dark:hover:text-teal-400 transition-colors" aria-label="Copy link">
                  <i className="fas fa-link"></i>
                </button>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-slate-400 hover:text-accent dark:hover:text-teal-400 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <i className="fab fa-linkedin"></i>
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-slate-400 hover:text-accent dark:hover:text-teal-400 transition-colors"
                  aria-label="Share on X"
                >
                  <i className="fab fa-x-twitter"></i>
                </a>
              </div>
            </header>

            {/* Cover image (optional) */}
            {post.cover_image_url && (
              <img
                src={absoluteUrl(post.cover_image_url)}
                alt={`Cover for ${post.title}`}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 mt-6"
                loading="lazy"
              />
            )}

            {/* Content */}
            <div className="mt-4">
              <Markdown content={post.content} />
            </div>

            {/* Footer nav */}
            <footer className="mt-14 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adjacent?.prev ? (
                  <Link to={`/blog/${adjacent.prev.slug}`} className="group p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-accent/50 dark:hover:border-teal-400/50 transition-colors">
                    <span className="text-xs text-slate-400 font-mono">← Previous</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-accent dark:group-hover:text-teal-400 mt-1 transition-colors">
                      {adjacent.prev.title}
                    </p>
                  </Link>
                ) : <div className="hidden sm:block" />}
                {adjacent?.next && (
                  <Link to={`/blog/${adjacent.next.slug}`} className="group p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-accent/50 dark:hover:border-teal-400/50 transition-colors sm:text-right">
                    <span className="text-xs text-slate-400 font-mono">Next →</span>
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-accent dark:group-hover:text-teal-400 mt-1 transition-colors">
                      {adjacent.next.title}
                    </p>
                  </Link>
                )}
              </div>
              <div className="mt-8 text-center">
                <Link to="/blog" className="text-sm font-medium text-accent dark:text-teal-400 hover:underline">
                  ← Back to all notes
                </Link>
              </div>
            </footer>
          </motion.article>
        )}
      </main>
    </div>
  );
};

export default BlogArticle;
