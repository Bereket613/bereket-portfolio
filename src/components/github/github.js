import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const GithubStats = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(4); 

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                const res = await fetch('https://api.github.com/users/Bereket613/repos?sort=updated&per_page=10');
                if (!res.ok) throw new Error('Failed to fetch GitHub data');
                const data = await res.json();
                
                setRepos(data);
                setLoading(false);
            } catch (err) {
                console.error("GitHub fetch error:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchRepos();
    }, []);

    const showMore = () => setVisibleCount(prev => prev + 4);

    if (error) return null; 

    return (
        <section id="github" className="py-20 px-6 md:px-12 lg:px-24 bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">GitHub Projects</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        Real-time stats from my recent open-source repositories.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                    </div>
                ) : (
                    <>
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.1 } },
                                hidden: {}
                            }}
                        >
                            <AnimatePresence>
                            {repos.slice(0, visibleCount).map((repo) => (
                                <motion.div 
                                    key={repo.id} 
                                    className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-accent/40 transition-all duration-300 group flex flex-col"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold group-hover:text-accent transition-colors truncate">
                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white group-hover:text-accent">
                                                {repo.name}
                                            </a>
                                        </h3>
                                        <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                            {repo.private ? 'Private' : 'Public'}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow line-clamp-2">
                                        {repo.description ? repo.description : 'No description provided.'}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                                        {repo.language && (
                                            <span className="flex items-center gap-1.5">
                                                <span className="w-3 h-3 rounded-full bg-accent"></span> 
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1" title="Stars">
                                            <i className="fas fa-star text-yellow-500"></i> {repo.stargazers_count}
                                        </span>
                                        <span className="flex items-center gap-1" title="Forks">
                                            <i className="fas fa-code-branch text-gray-500"></i> {repo.forks_count}
                                        </span>
                                        <span className="ml-auto text-xs text-gray-500">
                                            Updated: {new Date(repo.updated_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                            </AnimatePresence>
                        </motion.div>
                        
                        {visibleCount < repos.length && (
                            <div className="text-center mt-12">
                                <button 
                                    className="bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white px-8 py-3 rounded-full font-medium transition-colors"
                                    onClick={showMore}
                                >
                                    Load More Repositories
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
