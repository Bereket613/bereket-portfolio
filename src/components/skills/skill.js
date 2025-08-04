import React, { useState } from 'react';
import './skill.css';

const Skills = () => {
    const [activeSkill, setActiveSkill] = useState(null);

    const skillsData = {
        "Data Analysis": {
            icon: "📊",
            projects: [
                { name: "EDH (2016) Data Analysis", link: "https://github.com/Bereket613/EDH-Data-Analysis" },
                { name: "Age V Salary Analysis", link: "https://github.com/Bereket613/-Age-vs-Salary-Analysis-Exploratory-Explanatory-Data-Visualization-in-Python" }

            ]
        },
        "Machine Learning": {
            icon: "🤖",
            projects: [
                { name: "Diabetes Prediction", link: "https://github.com/Bereket613/Diabetes-ML-Project" },
                { name: "Book Recommendation", link: "https://github.com/Bereket613/Book-Recommendation-System-using-K-Nearest-Neighbors" },
                { name: "SMS spam classification", link: "https://github.com/Bereket613/Book-Recommendation-System-using-K-Nearest-Neighbors" },
                { name: "Diabetes Prediction", link: "https://github.com/Bereket613/Diabetes-ML-Project" }
            ]
        },
        "AI Development": {
            icon: "🧠",
            projects: [
                { name: "Chat Bot", link: "https://github.com/Bereket613/-AI-Chatbot-using-NLP-TF-IDF" },
                { name: "Rock Paper Scissors Game", link: "https://github.com/Bereket613/rock-paper-scissors-bot" },
                { name: "Chat Bot", link: "https://github.com/Bereket613/AI-ChatBot" }
            ]
        },
        "Python": {
            icon: "🐍",
            projects: [
                { name: "Bank Management System", link: "https://github.com/Bereket613/-NEGAT-Bank-Management-System" },
                { name: "Task Scheduler", link: "https://github.com/Bereket613/-Priority-Based-Task-Scheduler-in-Python" },
                { name: "Bank Management System", link: "https://github.com/Bereket613/-NEGAT-Bank-Management-System" },
            ]
        }
    };

    const toggleSkill = (skill) => {
        setActiveSkill(activeSkill === skill ? null : skill);
    };

    return (
        <section id="skills">
            <h2>Skills</h2>
            <div className="skillsContainer">
                <p>
                    I am a passionate data scientist with expertise in data analysis, machine learning, and AI development.
                    I specialize in extracting meaningful insights from data, building intelligent models, and developing innovative
                    solutions using Python, JavaScript, and ReactJS.
                </p>
                {Object.entries(skillsData).map(([skillName, skill], index) => (
                    <div key={index} className={`skill ${skillName.toLowerCase().replace(/\s/g, '-')}`}> 
                        <div onClick={() => toggleSkill(skillName)} style={{ cursor: 'pointer' }}>
                            <div className="skill-icon">{skill.icon}</div>
                            <p>{skillName}</p>
                        </div>
                        {activeSkill === skillName && (
                            <ul className="project-list">
                                {skill.projects.map((project, idx) => (
                                    <li key={idx}>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                                            {project.name}
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

export default Skills;
