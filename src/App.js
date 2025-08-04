import React, { useState } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/navbar';
import Intro from './components/Intro/intro';
import Skills from './components/skills/skill';
import Works from './components/work/work';
import Footer from './components/footer/footer';
import Contact from './components/contact/contact';
import About from './components/about/about';
import Experience from './components/experience/experience';
import Terms from './components/terms/terms';
import Privacy from './components/privacy/privacy';

// Portfolio Page
function PortfolioPage() {
  return (
    <>
      <Navbar />
      <Works />
      <Footer />
    </>
  );
}

// About Page
function AboutPage() {
  return (
    <>
      <Navbar />
      <About />
      <Footer />
    </>
  );
}

// Experience Page
function ExperiencePage() {
  return (
    <>
      <Navbar />
      <Experience />
      <Footer />
    </>
  );
}

// Home Page
function HomePage({ showContact, setShowContact }) {
  const closeContact = () => {
    setShowContact(false);
  };

  return (
    <>
      <Navbar />
      <Intro onContactClick={() => setShowContact(true)} />
      <Skills />
      <Works />

      {showContact && (
        <div className="contact-modal">
          <div className="modal-content">
            <Contact onClose={closeContact} />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

// Main App
function App() {
  const [showContact, setShowContact] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage showContact={showContact} setShowContact={setShowContact} />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
}

export default App;
