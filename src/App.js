import React, { useState, useContext } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar/navbar';
import Intro from './components/Intro/intro';
import Skills from './components/skills/skill';
import Works from './components/work/work';
import Footer from './components/footer/footer';
import Contact from './components/contact/contact';
import About from './components/about/about';
import Experience from './components/experience/experience';
import Blog from './components/blog/blog';
import Terms from './components/terms/terms';
import Privacy from './components/privacy/privacy';
import GithubStats from './components/github/github';
import Chatbot from './components/chatbot/chatbot';
import ResumePage from './components/Resume/resume';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

// Portfolio Page
function PortfolioPage() {
  return (
    <>
      <Navbar />
      <Works />
      <GithubStats />
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

// Blog Page
function BlogPage() {
  return (
    <>
      <Navbar />
      <Blog />
      <Footer />
    </>
  );
}

// CV / Resume Page
function CVPage() {
  return (
    <>
      <Navbar />
      <ResumePage />
      <Footer />
    </>
  );
}

// Home Page
function HomePage() {
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <Navbar />
      <Intro onContactClick={() => setShowContact(true)} />
      <Skills />
      <Works />
      <GithubStats />
      <Footer />
      {showContact && (
        <Contact onClose={() => setShowContact(false)} />
      )}
    </>
  );
}

// ThemeWrapper to apply dark class
function ThemedApp() {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme}>
      <ToastContainer position="bottom-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/cv" element={<CVPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
      </Routes>
      <Chatbot />
    </div>
  );
}

// Main App
function App() {
  return (
    <ThemeProvider>
      <Router basename="/bereket-portfolio">
        <ThemedApp />
      </Router>
    </ThemeProvider>
  );
}

export default App;
