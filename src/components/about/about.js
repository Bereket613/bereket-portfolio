import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <section className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">About Me</h1>

          <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              Hello! I'm <strong className="text-slate-900 dark:text-white">Bereket Getaw Haile</strong>, a web
              developer and data science student at{' '}
              <strong className="text-slate-900 dark:text-white">Debre Berhan University</strong>, Ethiopia. I'm
              building a solid foundation in software development and artificial intelligence.
            </p>
            <p>
              What draws me to data science is turning raw data into useful answers — finding patterns,
              solving concrete problems, and building models that make reasonable predictions. I believe
              data, used carefully, can improve decisions and drive real-world impact.
            </p>
            <p>
              Lately I've been working with{' '}
              <strong className="text-slate-900 dark:text-white">Python, Pandas, NumPy, Matplotlib, Seaborn,
              Scikit-learn</strong> and beginner-level <strong className="text-slate-900 dark:text-white">TensorFlow</strong>.
              My hands-on projects include recommendation systems, classification models, and visual
              dashboards for communicating results.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
            hidden: {}
          }}
        >
          {[
            {
              title: "What I'm working towards",
              content: <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Bridging data science and web development — building tools that put machine learning in front of real users, and continuing towards a career as a data scientist and AI developer.</p>
            },
            {
              title: "Skills & tools",
              content: (
                <ul className="space-y-1.5 list-none text-slate-600 dark:text-slate-400">
                  <li><strong className="text-slate-900 dark:text-white font-medium">Programming:</strong> Python, JavaScript, React, SQL</li>
                  <li><strong className="text-slate-900 dark:text-white font-medium">Data analysis:</strong> Pandas, NumPy, visualization</li>
                  <li><strong className="text-slate-900 dark:text-white font-medium">Machine learning:</strong> Scikit-learn, TensorFlow</li>
                </ul>
              )
            },
            {
              title: "Projects I'm proud of",
              content: (
                <ul className="space-y-1.5 list-none text-slate-600 dark:text-slate-400">
                  <li>Book Recommendation System</li>
                  <li>Image Classifier using CNN</li>
                  <li>Stock Price Trend Visualizer</li>
                </ul>
              )
            },
            {
              title: "Education & location",
              content: <p className="text-slate-600 dark:text-slate-400 leading-relaxed">BSc in Information Systems (in progress), Debre Berhan University. Based in Addis Ababa, Ethiopia.</p>
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-800"
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
              }}
            >
              <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">{item.title}</h2>
              {item.content}
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default About;
