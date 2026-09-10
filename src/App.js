import React, { useContext, useEffect, lazy, Suspense } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
// HashRouter so deep links (e.g. /about) work on GitHub Pages without server rewrites
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, ThemeContext } from './ThemeContext';
import { ToastContainer } from 'react-toastify';

import Navbar from './components/Navbar/navbar';
import Intro from './components/Intro/intro';
import Skills from './components/skills/skill';
import Works from './components/work/work';
import Footer from './components/footer/footer';
import GithubStats from './components/github/github';

// Lazy-loaded route components (code splitting)
const About = lazy(() => import('./components/about/about'));
const Experience = lazy(() => import('./components/experience/experience'));
const Blog = lazy(() => import('./components/blog/blog'));
const ResumePage = lazy(() => import('./components/Resume/resume'));
const Contact = lazy(() => import('./components/contact/contact'));
const Terms = lazy(() => import('./components/terms/terms'));
const Privacy = lazy(() => import('./components/privacy/privacy'));
const Chatbot = lazy(() => import('./components/chatbot/chatbot'));
const AdminLogin = lazy(() => import('./pages/admin/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

const LoadingFallback = () => (
  <div className="min-h-screen flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
  </div>
);

const renderLazy = (Component, props) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component {...props} />
  </Suspense>
);

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
      {renderLazy(About)}
      <Footer />
    </>
  );
}

// Experience Page
function ExperiencePage() {
  return (
    <>
      <Navbar />
      {renderLazy(Experience)}
      <Footer />
    </>
  );
}

// Blog Page
function BlogPage() {
  return (
    <>
      <Navbar />
      {renderLazy(Blog)}
      <Footer />
    </>
  );
}

// CV / Resume Page
function CVPage() {
  return (
    <>
      <Navbar />
      {renderLazy(ResumePage)}
      <Footer />
    </>
  );
}

// Contact Page
function ContactPage() {
  return (
    <>
      <Navbar />
      {renderLazy(Contact)}
      <Footer />
    </>
  );
}

// Home Page
function HomePage() {
  return (
    <>
      <Navbar />
      <Intro />
      <Skills />
      <Works />
      <GithubStats />
      <Footer />
    </>
  );
}

// ThemeWrapper to apply dark class
function ThemedApp() {
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  // Anonymous visit tracking (once per session)
  useEffect(() => {
    if (sessionStorage.getItem('visit-tracked')) return;
    sessionStorage.setItem('visit-tracked', '1');
    fetch(`${process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000'}/api/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page: location.pathname }),
      keepalive: true
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/terms" element={renderLazy(Terms)} />
        <Route path="/privacy" element={renderLazy(Privacy)} />
        {/* Admin Routes */}
        <Route path="/admin/login" element={renderLazy(AdminLogin)} />
        <Route path="/admin/dashboard/*" element={renderLazy(AdminDashboard)} />
      </Routes>
      {renderLazy(Chatbot)}
    </div>
  );
}

// Main App
function App() {
  return (
    <ThemeProvider>
      <Router>
        <ThemedApp />
      </Router>
    </ThemeProvider>
  );
}

export default App;
