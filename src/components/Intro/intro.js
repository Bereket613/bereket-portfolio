import React from 'react';
import background from '../../assets/image.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Intro = ({ onContactClick }) => {
  return (
    <section id="intro" className="relative h-[calc(100vh-4rem)] w-full max-w-7xl mx-auto overflow-hidden flex items-center px-6 md:px-12 lg:px-24">
      {/* Background Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-accentDark/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" style={{ animationDelay: '2s' }}></div>

      <motion.div 
        className="flex flex-col justify-center w-full md:w-1/2 z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, staggerChildren: 0.2 }}
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-2xl md:text-3xl font-light text-slate-700 dark:text-slate-300 mb-2"
        >
          Hello,
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white mb-4"
        >
          I am <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark animate-pulse">Bereket</span>
          <br />
          a Data Scientist
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-lg leading-relaxed"
        >
          I am a skilled data scientist with experience in machine learning, AI development, and building robust full-stack applications.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 items-center"
        >
            <Button onClick={onContactClick} variant="primary">
                Contact Me
            </Button>
            <Button variant="secondary" as={Link} to="/cv">
                View Dynamic CV
            </Button>
        </motion.div>
      </motion.div>
      <motion.div 
        className="absolute right-0 top-0 w-full md:w-1/2 h-full z-0 opacity-20 md:opacity-100 flex justify-end items-end"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
          <motion.img 
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            src={background} 
            alt="Bereket - Profile" 
            className="object-cover h-full md:h-[90%] w-auto max-w-none ml-auto drop-shadow-2xl"
          />
      </motion.div>
    </section>
  );
};

export default Intro;