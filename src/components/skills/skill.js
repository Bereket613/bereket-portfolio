import React from 'react';
import { skillsData } from '../../data/portfolioData';
import { motion } from 'framer-motion';

const skillIcons = {
  'Data Analysis': 'fas fa-chart-bar',
  'Machine Learning': 'fas fa-robot',
  'AI Development': 'fas fa-brain',
  'Python': 'fab fa-python',
};

const Skills = () => {
  return (
    <section id="skills" className="py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Skills</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
            Areas I work in, with the projects behind each one.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
            hidden: {}
          }}
        >
          {Object.entries(skillsData).map(([skillName, skill]) => (
            <motion.div
              key={skillName}
              className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800"
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <div className="flex items-center gap-2.5 mb-4">
                <i className={`${skillIcons[skillName] || 'fas fa-code'} text-accent dark:text-teal-400`}></i>
                <h3 className="font-semibold text-slate-900 dark:text-white">{skillName}</h3>
              </div>
              <ul className="space-y-2">
                {skill.projects.map((project, idx) => (
                  <li key={idx}>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-accent dark:hover:text-teal-400 transition-colors"
                    >
                      {project.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
