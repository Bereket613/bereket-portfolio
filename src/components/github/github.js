import React, { useState, useEffect } from 'react';
import './github.css';
import { motion, AnimatePresence } from 'framer-motion';

const GithubStats = () => {
    const [repos, setRepos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(4); // Show 4 by default

    useEffect(() => {
        const fetchRepos = async () => {
            try {
                // Fetch public repos for Bereket613
                const res = await fetch('https://api.github.com/users/Bereket613/repos?sort=updated&per_page=10');
                if (!res.ok) throw new Error('Failed to fetch GitHub data');
                const data = await res.json();
                
                // Filter out forks if desired, but here we just take the top updated repos
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

    if (loading) return <div className="github-section"><div className="loading">Loading GitHub stats...</div></div>;
    if (error) return null; // Fail silently or display a small error message

    return (
        <section id="github" className="github-section">
            <h2 className="section-title">GitHub Projects</h2>
            <p className="section-subtitle">Real-time stats from my recent open-source repositories.</p>

            <motion.div 
                className="github-grid"
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
                        className="github-card"
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 }
                        }}
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -5 }}
                    >
                        <div className="github-card-header">
                            <h3><a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a></h3>
                            <span className="repo-visibility">{repo.private ? 'Private' : 'Public'}</span>
                        </div>
                        <p className="repo-desc">
                            {repo.description ? repo.description : 'No description provided.'}
                        </p>
                        <div className="repo-stats">
                            {repo.language && (
                                <span className="stat-lang">
                                    <span className="lang-dot"></span> {repo.language}
                                </span>
                            )}
                            <span className="stat-icon">⭐ {repo.stargazers_count}</span>
                            <span className="stat-icon">🍴 {repo.forks_count}</span>
                        </div>
                        <div className="repo-footer">
                            Updated on {new Date(repo.updated_at).toLocaleDateString()}
                        </div>
                    </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>
            
            {visibleCount < repos.length && (
                <button className="button show-more-btn" onClick={showMore}>
                    Load More Repositories
                </button>
            )}
        </section>
    );
};

export default GithubStats;
