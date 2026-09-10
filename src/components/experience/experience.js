import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const response = await api.get('/api/experiences');
        setExperiences(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return (
    <section id="experience" className="py-20 px-6 md:px-12 min-h-screen">
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
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-accent"></div>
          </div>
        ) : error ? (
          <div className="mt-10 text-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-900">
            Unable to load experience data. Please try again later.
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center text-slate-500 dark:text-slate-400 py-12">
            No experience records yet.
          </div>
        ) : (
          <div className="mt-10 relative border-l-2 border-slate-200 dark:border-slate-800 pl-6 md:pl-8 space-y-10">
            {experiences.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3 h-3 rounded-full bg-accent dark:bg-teal-400 border-2 border-slate-50 dark:border-slate-950"></div>

                <div className="flex items-start gap-4">
                  {item.logo_url && (
                    <img
                      src={item.logo_url}
                      alt={`${item.organization} logo`}
                      loading="lazy"
                      className="w-11 h-11 rounded-lg object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <span className="text-sm text-slate-500 dark:text-slate-400">{item.duration}</span>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-0.5">{item.role}</h3>
                    <h4 className="text-slate-600 dark:text-slate-400 font-medium">{item.organization}</h4>

                    {item.description && (
                      <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
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
                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.tech_stack.map((tech, idx) => (
                          <span key={idx} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
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
