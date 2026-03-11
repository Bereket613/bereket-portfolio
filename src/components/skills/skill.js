import React, { useState } from 'react';
import './skill.css';
import { skillsData } from '../../data/portfolioData';
import { motion } from 'framer-motion';

const Skills = () => {
    const [activeSkill, setActiveSkill] = useState(null);

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
                <motion.div 
                    className="skills-grid"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.15 } },
                        hidden: {}
                    }}
                >
                {Object.entries(skillsData).map(([skillName, skill], index) => (
                    <motion.div 
                        key={index} 
                        className={`skill ${skillName.toLowerCase().replace(/\s/g, '-')}`}
                        variants={{
                            hidden: { opacity: 0, x: -30 },
                            visible: { opacity: 1, x: 0 }
                        }}
                    >
                        <div onClick={() => toggleSkill(skillName)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
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
                    </motion.div>
                ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
