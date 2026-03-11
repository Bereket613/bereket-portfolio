// src/components/about/About.jsx
import React from 'react';
import './about.css';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="about-page">
      <section className="about-section">
        <motion.div 
          className="about-content"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="about-title">About Me</h2>

          <p className="about-description">
            Hello! I'm <strong>Bereket Getaw Haile</strong>, a passionate web developer and aspiring data scientist from Ethiopia. I'm currently studying Data Science at <strong>Debre Berhan University</strong>, where I’m building a solid foundation in software development and artificial intelligence.
          </p>

          <p className="about-description">
            My true passion lies in <strong>data science</strong> — the art of turning raw data into meaningful insights. I enjoy working with data to uncover patterns, solve complex problems, and build models that can make smart predictions. I believe that data, when used wisely, has the power to improve lives and drive real-world impact.
          </p>

          <p className="about-description">
            I’m actively learning and practicing skills in <strong>machine learning, deep learning, and data analysis</strong> using tools like <strong>Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn</strong>, and beginner-level <strong>TensorFlow</strong>. I enjoy doing hands-on projects like recommendation systems, classification models, and building visual dashboards to communicate results.
          </p>

          <p className="about-description">
            In the future, I aim to become a professional data scientist and contribute to tech solutions in Ethiopia and globally. Whether it’s predicting trends, analyzing user behavior, or making intelligent bots, I’m excited to keep learning and building meaningful things with data.
          </p>

          <motion.div 
            className="about-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              visible: { transition: { staggerChildren: 0.2 } },
              hidden: {}
            }}
          >
            <motion.div 
              className="about-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h3>🎯 My Mission</h3>
              <p>
                To bridge the gap between intuitive design and intelligent systems by creating data-powered tools and applications that are both user-friendly and impactful.
              </p>
            </motion.div>

            <motion.div 
              className="about-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h3>🛠 Skills & Tools</h3>
              <ul>
                <li><strong>Programming:</strong> Python, JavaScript, React, HTML/CSS</li>
                <li><strong>Data Analysis:</strong> Pandas, NumPy, Matplotlib, Seaborn</li>
                <li><strong>Machine Learning:</strong> Scikit-learn, TensorFlow (beginner)</li>
                <li><strong>Web:</strong> REST APIs, Git, GitHub</li>
              </ul>
            </motion.div>

            <motion.div 
              className="about-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h3>📊 Favorite Projects</h3>
              <ul>
                <li>📚 Book Recommendation System</li>
                <li>🐶 Image Classifier using CNN</li>
                <li>📈 Stock Price Trend Visualizer</li>
              </ul>
            </motion.div>

            <motion.div 
              className="about-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h3>🎓 Education</h3>
              <p>
                BSc in Computer Science (in progress)<br />
                Debre Berhan University, Ethiopia
              </p>
            </motion.div>

            <motion.div 
              className="about-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <h3>📍 Based In</h3>
              <p>Addis Ababa, Ethiopia</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
