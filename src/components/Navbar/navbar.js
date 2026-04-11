import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../../assets/logo.png'; 
import { ThemeContext } from '../../ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/experience', label: 'Experience' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/blog', label: 'Blog' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg border-b border-white/20 dark:border-slate-800/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <motion.img 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            src={logo} alt="BG Logo" className="h-8 w-auto" 
          />
          <span className="font-bold text-lg text-slate-900 dark:text-white hidden sm:block group-hover:text-accent transition-colors">Bereket</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative font-medium transition-colors group ${
                location.pathname === link.to
                  ? 'text-accent'
                  : 'text-slate-700 dark:text-slate-300 hover:text-accent dark:hover:text-accent'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 bg-accent transition-all duration-300 ${location.pathname === link.to ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9, rotate: -15 }}
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-yellow-300 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {theme === 'dark' ? (
              <i className="fas fa-sun text-lg"></i>
            ) : (
              <i className="fas fa-moon text-lg"></i>
            )}
          </motion.button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 shadow-xl"
          >
            <div className="flex flex-col py-2">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={`px-6 py-4 font-medium transition-colors ${
                    location.pathname === link.to
                      ? 'text-accent bg-accent/10 border-l-4 border-accent'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-l-4 border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;