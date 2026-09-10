import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../api';
import { defaultSkills } from '../../data/portfolioData';

const Skills = () => {
  const [skillGroups, setSkillGroups] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await api.get('/api/skills');
        if (res.data && res.data.length > 0) {
          // Group flat records (id, category, name) by category
          const grouped = res.data.reduce((acc, s) => {
            if (!acc[s.category]) acc[s.category] = { category: s.category, description: '', skills: [] };
            if (s.description && !acc[s.category].description) acc[s.category].description = s.description;
            acc[s.category].skills.push(s.name);
            return acc;
          }, {});
          setSkillGroups(Object.values(grouped));
        } else {
          setSkillGroups(defaultSkills);
        }
      } catch (err) {
        console.error('Error fetching skills:', err);
        setSkillGroups(defaultSkills);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const groups = skillGroups || defaultSkills;

  return (
    <section id="skills" className="py-20 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Skills</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl">
            The areas I work in and the tools I use.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-accent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {groups.map((group, idx) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white">{group.category}</h3>
                {group.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">{group.description}</p>
                )}
                <ul className="flex flex-wrap gap-1.5 mt-4">
                  {group.skills.map((skill, i) => (
                    <li
                      key={i}
                      className="font-mono text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Skills;
