import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CACHE_KEY = 'github-repos-cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const GithubStats = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [started, setStarted] = useState(false);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);

    const fetchRepos = async () => {
        setStarted(true);
        setLoading(true);
        setError(null);

        // Serve from cache when fresh to avoid unnecessary API requests
        try {
            const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
            if (cached && Date.now() - cached.time < CACHE_TTL && Array.isArray(cached.repos)) {
                setRepos(cached.repos);
                setLoading(false);
                return;
            }
        } catch { /* ignore malformed cache */ }

        try {
            const res = await fetch('https://api.github.com/users/Bereket613/repos?sort=updated&per_page=30');
            if (res.status === 403 || res.status === 429) {
                throw new Error('GitHub API rate limit reached. Try again in a few minutes.');
            }
            if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
            const data = await res.json();
            setRepos(data);
            sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), repos: data }));
        } catch (err) {
            console.error("GitHub fetch error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const showMore = () => setVisibleCount(prev => prev + 6);

    return (
        <section id="github" className="py-20 px-6 md:px-12 bg-slate-100/60 dark:bg-slate-900/60">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">GitHub Projects</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
                        Live data from my GitHub repositories, fetched on demand.
                    </p>
                </motion.div>

                {!started ? (
                    <div className="mt-8 text-center">
                        <button
                            onClick={fetchRepos}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-accent hover:text-accent dark:hover:border-teal-400 dark:hover:text-teal-400 transition-colors"
                        >
                            <i className="fab fa-github text-lg"></i> View GitHub Projects
                        </button>
                    </div>
                ) : loading ? (
                    <div className="flex justify-center items-center h-40" role="status" aria-label="Loading repositories">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-accent"></div>
                    </div>
                ) : error ? (
                    <div className="mt-8 text-center">
                        <p className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-900 inline-flex items-center gap-2">
                            <i className="fas fa-triangle-exclamation"></i> Unable to load repositories: {error}
                        </p>
                        <div className="mt-4">
                            <button
                                onClick={fetchRepos}
                                className="px-5 py-2 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-accent hover:text-accent dark:hover:border-teal-400 dark:hover:text-teal-400 transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                ) : repos.length === 0 ? (
                    <p className="mt-8 text-center text-slate-500 dark:text-slate-400">No public repositories found.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                            {repos.slice(0, visibleCount).map((repo) => (
                                <div
                                    key={repo.id}
                                    className="bg-white dark:bg-slate-900 rounded-lg p-5 border border-slate-200 dark:border-slate-800 hover:border-accent/50 dark:hover:border-teal-400/50 hover:shadow-sm transition-all duration-200 flex flex-col"
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <h3 className="text-base font-semibold">
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-slate-900 dark:text-white hover:text-accent dark:hover:text-teal-400 transition-colors break-all"
                                            >
                                                {repo.name}
                                            </a>
                                        </h3>
                                        {repo.language && (
                                            <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full whitespace-nowrap border border-slate-200 dark:border-slate-700">
                                                {repo.language}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex-grow line-clamp-2">
                                        {repo.description || 'No description provided.'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                                        <span className="flex items-center gap-1.5" title="Stars">
                                            <i className="fas fa-star text-amber-500"></i> {repo.stargazers_count}
                                        </span>
                                        <span className="flex items-center gap-1.5" title="Forks">
                                            <i className="fas fa-code-branch"></i> {repo.forks_count}
                                        </span>
                                        <span className="ml-auto">
                                            Updated {new Date(repo.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {visibleCount < repos.length && (
                            <div className="text-center mt-8">
                                <button
                                    className="px-6 py-2.5 rounded-lg text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-accent hover:text-accent dark:hover:border-teal-400 dark:hover:text-teal-400 transition-colors"
                                    onClick={showMore}
                                >
                                    Load more repositories
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default GithubStats;
