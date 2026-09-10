import React from 'react';
import background from '../../assets/image.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const GITHUB_URL = 'https://github.com/Bereket613';

const Intro = ({ onContactClick }) => {
  return (
    <section id="intro" className="min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto flex items-center px-6 md:px-12">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 w-full py-16 md:py-0">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-mono text-sm text-accent dark:text-teal-400 mb-3">Bereket Getaw</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
            AI / Machine Learning Engineer
          </h1>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            I build practical AI systems across machine learning, NLP, computer vision, and big data —
            including privacy-preserving ML, RAG systems, and agentic AI. Much of my recent work focuses
            on Ethiopian language technology, like Amharic NLP.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button variant="primary" as={Link} to="/portfolio">
              View Projects
            </Button>
            <Button variant="secondary" as="a" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-github"></i> GitHub
            </Button>
            <Button variant="secondary" as={Link} to="/contact">
              Contact Me
            </Button>
            <Button variant="secondary" as="a" href={process.env.PUBLIC_URL + '/resume.pdf'} download="Bereket-Getaw-CV.pdf">
              Download CV
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 flex justify-center md:justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <img
            src={background}
            alt="Bereket Getaw"
            className="max-h-[380px] w-auto object-contain rounded-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Intro;
