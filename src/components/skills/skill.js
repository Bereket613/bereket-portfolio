import React, { useState } from 'react';
import { skillsData } from '../../data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion';

const Skills = () => {
    const [activeSkill, setActiveSkill] = useState(null);

    const toggleSkill = (skill) => {
        setActiveSkill(activeSkill === skill ? null : skill);
    };

    return (
        <section id="skills" className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Skills & Expertise</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                        I am a passionate data scientist with expertise in data analysis, machine learning, and AI development. Click on a skill to see related projects.
                    </p>
                </motion.div>

                <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={{
                        visible: { transition: { staggerChildren: 0.15 } },
                        hidden: {}
                    }}
                >
                    {Object.entries(skillsData).map(([skillName, skill]) => (
                        <motion.div 
                            key={skillName}
                            className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                                activeSkill === skillName
                                    ? 'border-accent shadow-accent/20 shadow-lg'
                                    : 'border-gray-200 dark:border-gray-700'
                            }`}
                            onClick={() => toggleSkill(skillName)}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="text-3xl">{skill.icon}</div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{skillName}</h3>
                                <i className={`fas fa-chevron-${activeSkill === skillName ? 'up' : 'down'} ml-auto text-gray-400`}></i>
                            </div>

                            <AnimatePresence>
                                {activeSkill === skillName && (
                                    <motion.ul
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden space-y-2"
                                    >
                                        {skill.projects.map((project, idx) => (
                                            <li key={idx}>
                                                <a 
                                                    href={project.link} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent transition-colors"
                                                >
                                                    <span className="text-accent">▹</span>
                                                    {project.name}
                                                </a>
                                            </li>
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Skills;
