import React from 'react';
import background from '../../assets/image.png';
import resumePdf from '../../assets/resume.pdf';
import './intro.css';
import { motion } from 'framer-motion';

const Intro = ({ onContactClick }) => {
  return (
    <section id="intro">
      <motion.div 
        className="introContent"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="hello">Hello</span>
        <span className="introText">
          I am <span className="introName">Bereket</span>
          <br />
          a Data Scientist
        </span>
        <p className="introParagraph">
          I am a skilled data scientist with experience in <br/>machine learning and AI development.
        </p>
        <div className="intro-actions">
            <motion.button 
                className="button" 
                onClick={onContactClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Contact
            </motion.button>
            <motion.a 
                href={resumePdf} 
                target="_blank" 
                rel="noopener noreferrer"
                className="button resume-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                View Resume
            </motion.a>
            <motion.a 
                href={resumePdf} 
                download="Bereket_Resume.pdf"
                className="button resume-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Download CV
            </motion.a>
        </div>
      </motion.div>
      <motion.img 
        src={background} 
        alt="profile" 
        className="background" 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
    </section>
  );
};

export default Intro;