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
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">About</h1>

          <div className="mt-6 space-y-5 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            <p>
              I'm <strong className="text-slate-900 dark:text-white">Bereket Getaw</strong>, an AI/ML
              engineer. I build practical AI systems across machine learning, deep learning, NLP,
              computer vision, and big data — from data processing and model training through to
              usable applications.
            </p>
            <p>
              My work spans several areas: supervised and unsupervised learning, transformer-based NLP,
              RAG systems and agentic AI, and computer vision tasks like classification, detection, and
              pose estimation. I also care about{' '}
              <strong className="text-slate-900 dark:text-white">privacy-preserving machine learning</strong> —
              building systems that can learn from sensitive data without exposing it.
            </p>
            <p>
              A recurring focus of mine is{' '}
              <strong className="text-slate-900 dark:text-white">Ethiopian language AI</strong> — projects
              like Amharic sign language detection, Amharic fake news detection, encrypted Amharic
              sentiment analysis, and multilingual RAG chatbots. Low-resource languages are underserved
              by modern NLP, and I want to help close that gap.
            </p>
            <p>
              I studied at Debre Berhan University, where I co-founded{' '}
              <strong className="text-slate-900 dark:text-white">DataParse Club</strong>, a student data
              and AI community, and completed a 3-month internship at{' '}
              <strong className="text-slate-900 dark:text-white">INSA</strong> (Information Network
              Security Agency) working on machine learning and privacy-preserving AI.
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
              title: "What I build",
              content: <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Applied ML systems: RAG chatbots, fraud and risk classification models, computer vision pipelines for agriculture and infrastructure, and NLP for Amharic.</p>
            },
            {
              title: "Problems I like",
              content: <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Ambiguous, real-world problems where the data is messy and the solution has to actually work — not just score well in a notebook.</p>
            },
            {
              title: "Direction",
              content: <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Going deeper into large language models, agentic AI systems, and privacy-preserving machine learning for sensitive domains.</p>
            },
            {
              title: "Beyond engineering",
              content: <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Community building through DataParse Club — organizing, sharing knowledge, and helping other students get into data and AI.</p>
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
