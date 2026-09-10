import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
    { to: '/cv', label: 'Resume' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-colors duration-200 ${
      isScrolled || menuOpen
        ? 'bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800'
        : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="Home">
          <img src={logo} alt="Bereket Getaw logo" className="h-8 w-auto" />
          <span className="font-semibold text-lg text-slate-900 dark:text-white hidden sm:block">Bereket</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`font-medium text-sm transition-colors ${
                location.pathname === link.to
                  ? 'text-accent dark:text-teal-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-accent dark:hover:text-teal-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-accent dark:hover:text-teal-400 transition-colors"
          >
            {theme === 'dark' ? (
              <i className="fas fa-sun text-base"></i>
            ) : (
              <i className="fas fa-moon text-base"></i>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
          >
            <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'} text-base`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col py-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  location.pathname === link.to
                    ? 'text-accent dark:text-teal-400 bg-accent/5 dark:bg-teal-400/5 border-l-2 border-accent dark:border-teal-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
