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
    <section id="experience" className="py-20 px-6 md:px-12 lg:px-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Experience</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : error ? (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
                Failed to load experience data: {error}
            </div>
        ) : experiences.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
              No experience records found.
          </div>
        ) : (
          <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-4 md:ml-0 md:border-l-0">
            {/* Timeline Line for desktop */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>

            {experiences.map((item, index) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`mb-12 flex flex-col md:flex-row items-center justify-between w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-[-9px] md:left-1/2 md:transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-accent border-4 border-gray-50 dark:border-gray-900 z-10"></div>
                
                {/* Empty Space for alignment on Desktop */}
                <div className="hidden md:block w-5/12"></div>

                {/* Content Card */}
                <div className="w-full md:w-5/12 pl-6 md:pl-0">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300 relative">
                    {/* Arrow pointing to timeline */}
                    <div className={`hidden md:block absolute top-6 w-4 h-4 bg-white dark:bg-gray-800 border-t border-l border-gray-100 dark:border-gray-700 transform rotate-45 ${index % 2 === 0 ? '-left-2 -border-r -border-b' : '-right-2 border-r border-b border-t-0 border-l-0'}`}></div>
                    
                    <span className="text-accent font-semibold text-sm mb-2 block">{item.duration}</span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{item.role}</h3>
                    <h4 className="text-md text-gray-600 dark:text-gray-400 font-medium mb-4">{item.organization}</h4>
                    
                    <p className="text-gray-700 dark:text-gray-300 mb-4">{item.description}</p>
                    
                    {item.key_achievements && item.key_achievements.length > 0 && (
                      <ul className="mb-4 space-y-2">
                        {item.key_achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-accent mr-2 mt-1"><i className="fas fa-check-circle"></i></span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.tech_stack && item.tech_stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {item.tech_stack.map((tech, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">
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
