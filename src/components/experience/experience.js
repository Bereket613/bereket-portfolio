import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';
import { experienceData } from '../../data/portfolioData';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get('/api/experiences');
        if (response.data && response.data.length > 0) {
          setExperiences(response.data);
        } else {
          setExperiences(experienceData);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setExperiences(experienceData);
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-20 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Experience</h2>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-accent"></div>
          </div>
        ) : experiences.length === 0 ? (
          <p className="text-center text-slate-500 dark:text-slate-400 py-12">No experience records yet.</p>
        ) : (
          <div className="mt-10 divide-y divide-slate-200 dark:divide-slate-800">
            {experiences.map((item, index) => (
              <motion.div
                key={item.id || item.organization}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="py-7 first:pt-0 last:pb-0"
              >
                <div className="md:flex md:gap-8">
                  {/* Date / type label */}
                  <div className="md:w-32 flex-shrink-0">
                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {item.duration || '—'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 mt-2 md:mt-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.organization}</h3>
                    {item.role && (
                      <p className="text-sm text-accent dark:text-teal-400 font-medium mt-0.5">{item.role}</p>
                    )}

                    {item.description && (
                      <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed text-[15px]">
                        {item.description}
                      </p>
                    )}

                    {item.key_achievements && item.key_achievements.length > 0 && (
                      <ul className="mt-3 space-y-1.5">
                        {item.key_achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                            <span className="text-accent dark:text-teal-400 mr-2 mt-0.5">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.tech_stack && item.tech_stack.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tech_stack.map((tech, idx) => (
                          <span key={idx} className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
