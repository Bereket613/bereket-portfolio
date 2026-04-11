import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../api';

const Work = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Now fetching plain flat records from the PostgreSQL API
                const response = await api.get('/api/projects');
                setProjects(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const categories = ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

    const filteredProjects = projects.filter(project => 
        activeFilter === 'All' || project.category === activeFilter
    );

    return (
        <section id="portfolio" className="py-20 px-6 md:px-12 lg:px-24 bg-transparent min-h-screen relative z-10">
            <div className="max-w-7xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark mb-6">Featured My Portfolio</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        I specialize in artificial intelligence, machine learning, data visualization, and web development. Explore my recent work below.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
                        Failed to load projects: {error}
                    </div>
                ) : (
                    <>
                        {/* Filters */}
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            {categories.map(category => (
                                <button 
                                    key={category} 
                                    className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                        activeFilter === category 
                                        ? 'bg-gradient-to-r from-accent to-accentDark text-white shadow-lg shadow-accent/20' 
                                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700 hover:border-accent dark:hover:border-accent hover:text-accent dark:hover:text-accent'
                                    }`}
                                    onClick={() => setActiveFilter(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Project Grid */}
                        <motion.div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            layout
                        >
                            <AnimatePresence>
                                {filteredProjects.map((project) => (
                                    <motion.div 
                                        key={project.id || project.title}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                        whileHover={{ y: -10, transition: { duration: 0.2 } }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/50 dark:border-white/10 hover:shadow-[0_20px_40px_rgba(79,70,229,0.25)] hover:border-accent/40 transition-all duration-500 flex flex-col h-full group relative"
                                    >
                                        <div className="h-48 overflow-hidden relative bg-gray-200 dark:bg-gray-800">
                                            {project.image_url ? (
                                                <img
                                                    src={project.image_url}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <i className="fas fa-image text-4xl"></i>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-6 flex-grow flex flex-col relative z-10 bg-transparent">
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors">{project.title}</h3>
                                                <span className="text-xs font-semibold bg-accent/10 text-accent px-3 py-1 rounded-full whitespace-nowrap ml-2">
                                                    {project.category}
                                                </span>
                                            </div>
                                            
                                            <p className="text-gray-600 dark:text-gray-400 mb-6 flex-grow line-clamp-3">
                                                {project.description}
                                            </p>

                                            {/* Tech Stack */}
                                            {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {project.tech_stack.map((tech, idx) => (
                                                        <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-4 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                                                {project.live_demo_url && (
                                                    <a 
                                                        href={project.live_demo_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-2 bg-accent hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors"
                                                    >
                                                        <i className="fas fa-external-link-alt"></i> Live Demo
                                                    </a>
                                                )}
                                                {project.github_url && (
                                                    <a 
                                                        href={project.github_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-2 rounded-lg font-medium transition-colors"
                                                    >
                                                        <i className="fab fa-github"></i> GitHub
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                        
                        {filteredProjects.length === 0 && (
                            <div className="text-center text-gray-500 py-12">
                                No projects found in this category.
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

export default Work;
