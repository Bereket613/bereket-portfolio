import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 lg:px-24 transition-colors duration-300">
      <section className="max-w-6xl mx-auto">
        <motion.div 
          className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] p-8 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(79,70,229,0.15)] border border-white/50 dark:border-white/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Decorative gradients */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent opacity-20 blur-[80px] rounded-full pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accentDark opacity-10 blur-[80px] rounded-full pointer-events-none"></div>

          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark mb-8 relative inline-block">
            About Me
            <span className="absolute -bottom-2 left-0 w-[40%] h-1 bg-gradient-to-r from-accent to-accentDark rounded-full"></span>
          </h2>

          <div className="space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300 relative z-10">
            <p>
              Hello! I'm <strong className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark font-bold">Bereket Getaw Haile</strong>, a passionate web developer and aspiring data scientist from Ethiopia. I'm currently studying Data Science at <strong className="text-accent">Debre Berhan University</strong>, where I’m building a solid foundation in software development and artificial intelligence.
            </p>

            <p>
              My true passion lies in <strong className="text-accent">data science</strong> — the art of turning raw data into meaningful insights. I enjoy working with data to uncover patterns, solve complex problems, and build models that can make smart predictions. I believe that data, when used wisely, has the power to improve lives and drive real-world impact.
            </p>

            <p>
              I’m actively learning and practicing skills in <strong className="text-accent">machine learning, deep learning, and data analysis</strong> using tools like <strong className="text-slate-900 dark:text-white">Python, Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn</strong>, and beginner-level <strong className="text-slate-900 dark:text-white">TensorFlow</strong>. I enjoy doing hands-on projects like recommendation systems, classification models, and building visual dashboards to communicate results.
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
              hidden: {}
            }}
          >
            {[
              { title: "🎯 My Mission", desc: "To bridge the gap between intuitive design and intelligent systems by creating data-powered tools and applications." },
              { title: "🛠 Skills & Tools", content: (
                <ul className="space-y-2 list-none">
                  <li><span className="text-accent mr-2">▹</span><strong>Programming:</strong> Python, JavaScript, React, SQL</li>
                  <li><span className="text-accent mr-2">▹</span><strong>Data Analysis:</strong> Pandas, NumPy, Visualizations</li>
                  <li><span className="text-accent mr-2">▹</span><strong>ML:</strong> Scikit-learn, TensorFlow</li>
                </ul>
              ) },
              { title: "📊 Favorite Projects", content: (
                <ul className="space-y-2 list-none">
                  <li><span className="text-accent mr-2">▹</span>Book Recommendation System</li>
                  <li><span className="text-accent mr-2">▹</span>Image Classifier using CNN</li>
                  <li><span className="text-accent mr-2">▹</span>Stock Price Trend Visualizer</li>
                </ul>
              ) },
              { title: "🎓 Education", desc: "BSc in Computer Science (in progress)\nDebre Berhan University, Ethiopia" },
              { title: "📍 Based In", desc: "Addis Ababa, Ethiopia" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-white/40 dark:border-slate-700/30 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] hover:-translate-y-2 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-500 group"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
                }}
              >
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentDark mb-4 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                {item.desc ? (
                  <p className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">{item.desc}</p>
                ) : (
                  <div className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.content}</div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;
