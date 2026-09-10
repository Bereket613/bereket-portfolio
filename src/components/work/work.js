import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from '../../api';
import { projectsData, projectCategories } from '../../data/portfolioData';

const Work = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/api/projects');
                // Use backend data when available; otherwise fall back to the static project list
                if (response.data && response.data.length > 0) {
                    setProjects(response.data);
                } else {
                    setProjects(projectsData);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err.message);
                setProjects(projectsData);
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const categories = projectCategories.length > 1
        ? projectCategories
        : ['All', ...new Set(projects.map(p => p.category).filter(Boolean))];

    const filteredProjects = projects.filter(project =>
        activeFilter === 'All' || project.category === activeFilter
    );

    return (
        <section id="portfolio" className="py-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
                        Data science, machine learning, and web development projects I have built.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-accent"></div>
                    </div>
                ) : error ? (
                    <p className="mt-8 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-lg p-3 inline-flex items-center gap-2">
                        <i className="fas fa-triangle-exclamation"></i>
                        Live project data is unavailable — showing the static project list.
                    </p>
                ) : (
                    <>
                        {categories.length > 2 && (
                            <div className="flex flex-wrap gap-2 mt-8" role="group" aria-label="Filter projects by category">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        aria-pressed={activeFilter === category}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                            activeFilter === category
                                                ? 'bg-accent text-white'
                                                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:border-accent dark:hover:border-teal-400 hover:text-accent dark:hover:text-teal-400'
                                        }`}
                                        onClick={() => setActiveFilter(category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {filteredProjects.map((project) => (
                                <div
                                    key={project.id || project.title}
                                    className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-accent/50 dark:hover:border-teal-400/50 hover:shadow-md transition-all duration-200 flex flex-col group"
                                >
                                    {project.image_url && (
                                        <div className="h-40 overflow-hidden bg-slate-100 dark:bg-slate-800">
                                            <img
                                                src={project.image_url}
                                                alt={`${project.title} screenshot`}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="p-5 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start gap-2 mb-2">
                                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{project.title}</h3>
                                            {project.category && (
                                                <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full whitespace-nowrap mt-0.5 border border-slate-200 dark:border-slate-700">
                                                    {project.category}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-grow line-clamp-3">
                                            {project.description}
                                        </p>

                                        {Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {project.tech_stack.map((tech, idx) => (
                                                    <span key={idx} className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {(project.github_url || project.live_demo_url || project.description) && (
                                            <div className="flex gap-2 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
                                                {project.description && project.description.length > 120 && (
                                                    <button
                                                        onClick={() => setSelectedProject(project)}
                                                        className="flex-1 flex items-center justify-center gap-2 text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-accent hover:text-accent dark:hover:border-teal-400 dark:hover:text-teal-400 py-2 rounded-md font-medium transition-colors"
                                                    >
                                                        Details
                                                    </button>
                                                )}
                                                {project.live_demo_url && (
                                                    <a
                                                        href={project.live_demo_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex-1 flex items-center justify-center gap-2 text-sm bg-accent hover:bg-accentDark text-white py-2 rounded-md font-medium transition-colors"
                                                    >
                                                        <i className="fas fa-external-link-alt text-xs"></i> Live Demo
                                                    </a>
                                                )}
                                                {project.github_url && (
                                                    <a
                                                        href={project.github_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={`${project.title} source code on GitHub`}
                                                        className="flex items-center justify-center text-sm border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-accent hover:text-accent dark:hover:border-teal-400 dark:hover:text-teal-400 py-2 px-3.5 rounded-md font-medium transition-colors"
                                                    >
                                                        <i className="fab fa-github"></i>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProjects.length === 0 && (
                            <div className="text-center text-slate-500 dark:text-slate-400 py-12">
                                No projects in this category yet.
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center p-4"
                        onClick={() => setSelectedProject(null)}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`${selectedProject.title} details`}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.15 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-slate-900 rounded-lg max-w-xl w-full shadow-xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
                        >
                            {selectedProject.image_url && (
                                <div className="h-52 bg-slate-100 dark:bg-slate-800">
                                    <img src={selectedProject.image_url} alt={`${selectedProject.title} screenshot`} className="w-full h-full object-cover" />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{selectedProject.title}</h3>
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="w-8 h-8 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                        aria-label="Close details"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>

                                {selectedProject.category && (
                                    <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                                        {selectedProject.category}
                                    </span>
                                )}

                                <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {selectedProject.description}
                                </p>

                                {Array.isArray(selectedProject.tech_stack) && selectedProject.tech_stack.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {selectedProject.tech_stack.map((tech, idx) => (
                                            <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3 mt-6">
                                    {selectedProject.live_demo_url && (
                                        <a
                                            href={selectedProject.live_demo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-accent hover:bg-accentDark text-white py-2.5 rounded-md font-medium transition-colors text-sm"
                                        >
                                            <i className="fas fa-external-link-alt text-xs"></i> Live Demo
                                        </a>
                                    )}
                                    {selectedProject.github_url && (
                                        <a
                                            href={selectedProject.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 min-w-[120px] flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-accent hover:text-accent dark:hover:border-teal-400 dark:hover:text-teal-400 py-2.5 rounded-md font-medium transition-colors text-sm"
                                        >
                                            <i className="fab fa-github"></i> View Source
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Work;
