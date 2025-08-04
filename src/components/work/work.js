import React, { useState } from "react";
import './work.css';
import AI from '../../assets/AI.png';
import ML from '../../assets/ML.png';
import DataViz from '../../assets/datavisualization.jpg';
import Python from '../../assets/python.jpg';

const Work = () => {
    const [selected, setSelected] = useState(null);

    const projects = [
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

    const handleImageClick = (index) => {
        setSelected(selected === index ? null : index);
    };

    return (
        <section className="work-section">
            <h1>Portfolio</h1>
            <p>
                I specialize in artificial intelligence, machine learning, data visualization, and Python development.
                With a strong passion for solving complex problems, I create intelligent systems, predictive models,
                and interactive dashboards that turn data into insights.
            </p>

            <div className="work-container">
                {projects.map((project, index) => (
                    <div className="work-item" key={index}>
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
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Work;
