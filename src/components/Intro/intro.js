import React from 'react';
import background from '../../assets/image.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Intro = ({ onContactClick }) => {
  return (
    <section id="intro" className="min-h-[calc(100vh-4rem)] w-full max-w-6xl mx-auto flex items-center px-6 md:px-12">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14 w-full">
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
            Bereket Getaw
          </h1>
          <p className="text-xl md:text-2xl text-accent dark:text-teal-400 font-medium mt-2">
            Data Scientist &amp; AI Developer
          </p>
          <p className="mt-5 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-xl">
            I build machine learning models and data-driven applications in Python, and I develop
            web tools around them. Most of my work so far has been in data analysis, prediction
            models, and NLP — you can browse it all below.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button variant="primary" as={Link} to="/portfolio">
              View Projects
            </Button>
            <Button variant="secondary" as="a" href={process.env.PUBLIC_URL + '/resume.pdf'} download="Bereket-Getaw-Resume.pdf">
              Download Resume
            </Button>
            <Button variant="secondary" onClick={onContactClick}>
              Contact Me
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
            className="max-h-[420px] w-auto object-contain rounded-lg"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Intro;
