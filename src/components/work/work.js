import React, { useState, useEffect } from "react";
import './work.css';
import AI from '../../assets/AI.png';
import ML from '../../assets/ML.png';
import DataViz from '../../assets/datavisualization.jpg';
import Python from '../../assets/python.jpg';
import { motion, AnimatePresence } from "framer-motion";

const categoryImages = {
    'AI Project': AI,
    'Machine Learning': ML,
    'Data Visualization': DataViz,
    'Python Application': Python,
    'General': Python
};

const Work = () => {
    const [selected, setSelected] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/projects`);
                if (!response.ok) {
                    throw new Error('Failed to fetch projects');
                }
                const data = await response.json();

                // Transform API data to group by category if needed, 
                // or just handle the flat list if that's what's expected.
                // Based on UI, it expects grouped categories.
                const grouped = data.reduce((acc, project) => {
                    const existing = acc.find(p => p.title === project.category);
                    if (existing) {
                        existing.projectLinks.push({ name: project.title, link: project.link });
                    } else {
                        acc.push({
                            title: project.category,
                            // Map category to image, fallback to Python if not found or if image is missing
                            image: categoryImages[project.category] || Python,
                            description: `Projects in ${project.category}`,
                            projectLinks: [{ name: project.title, link: project.link }]
                        });
                    }
                    return acc;
                }, []);

                setProjects(grouped.length > 0 ? grouped : getFallbackProjects());
                setLoading(false);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError(err.message);
                setProjects(getFallbackProjects());
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const getFallbackProjects = () => [
        {
            image: AI,
            title: "AI Project",
            description: "Advanced artificial intelligence implementation",
            projectLinks: [
                { name: "Chat Bot", link: "https://github.com/Bereket613/-AI-Chatbot-using-NLP-TF-IDF" },
                { name: "Rock Paper Scissors Game", link: "https://github.com/Bereket613/rock-paper-scissors-bot" },
                { name: "Chat Bot v2", link: "https://github.com/Bereket613/AI-ChatBot" }
            ]
        },
        {
            image: ML,
            title: "Machine Learning",
            description: "Predictive modeling and analysis",
            projectLinks: [
                { name: "Diabetes Prediction", link: "https://github.com/Bereket613/Diabetes-ML-Project" },
                { name: "Book Recommendation", link: "https://github.com/Bereket613/Book-Recommendation-System-using-K-Nearest-Neighbors" },
                { name: "SMS Spam Classification", link: "https://github.com/Bereket613/Book-Recommendation-System-using-K-Nearest-Neighbors" }
            ]
        },
        {
            image: DataViz,
            title: "Data Visualization",
            description: "Interactive data dashboards",
            projectLinks: [
                { name: "EDH (2016) Data Analysis", link: "https://github.com/Bereket613/EDH-Data-Analysis" },
                { name: "Age vs Salary Analysis", link: "https://github.com/Bereket613/-Age-vs-Salary-Analysis-Exploratory-Explanatory-Data-Visualization-in-Python" }
            ]
        },
        {
            image: Python,
            title: "Python Application",
            description: "Data processing and automation",
            projectLinks: [
                { name: "Bank Management System", link: "https://github.com/Bereket613/-NEGAT-Bank-Management-System" },
                { name: "Task Scheduler", link: "https://github.com/Bereket613/-Priority-Based-Task-Scheduler-in-Python" }
            ]
        }
    ];

    const [activeFilter, setActiveFilter] = useState('All');

    const categories = ['All', ...new Set((projects.length > 0 ? projects : getFallbackProjects()).map(p => p.title))];

    const handleImageClick = (index) => {
        setSelected(selected === index ? null : index);
    };

    const filteredProjects = projects.filter(project => 
        activeFilter === 'All' || project.title === activeFilter
    );

    if (loading) return <section className="work-section"><div className="loading">Loading projects...</div></section>;
    if (error) console.warn("Using fallback projects due to error:", error);

    return (
        <section className="work-section">
            <h1>Portfolio</h1>
            <p>
                I specialize in artificial intelligence, machine learning, data visualization, and Python development.
                With a strong passion for solving complex problems, I create intelligent systems, predictive models,
                and interactive dashboards that turn data into insights.
            </p>

            <div className="filter-container">
                {categories.map(category => (
                    <button 
                        key={category} 
                        className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                        onClick={() => {
                            setActiveFilter(category);
                            setSelected(null); // Reset selection when filtering
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>

            <motion.div 
                className="work-container"
                layout
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                    visible: { transition: { staggerChildren: 0.1 } },
                    hidden: {}
                }}
            >
                <AnimatePresence>
                {filteredProjects.map((project, index) => (
                    <motion.div 
                        className="work-item" 
                        key={project.title}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0 }
                        }}
                    >
                        <img
                            src={project.image}
                            alt={project.title}
                            className="work-img"
                            onClick={() => handleImageClick(index)}
                        />
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>

                        {selected === index && (
                            <ul className="project-list">
                                {project.projectLinks.map((proj, idx) => (
                                    <li key={idx}>
                                        <a href={proj.link} target="_blank" rel="noopener noreferrer">
                                            {proj.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
};

export default Work;

