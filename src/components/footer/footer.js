import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-6 md:px-12 lg:px-24 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-gray-700">
                    <div>
                        <h3 className="text-xl font-bold mb-3">Bereket Getaw</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            AI/ML engineer based in Addis Ababa, Ethiopia. Working on machine learning, NLP, computer vision, and big data systems.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-3">Quick Links</h4>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/" className="hover:text-accent transition-colors">Home</Link></li>
                            <li><Link to="/about" className="hover:text-accent transition-colors">About</Link></li>
                            <li><Link to="/experience" className="hover:text-accent transition-colors">Experience</Link></li>
                            <li><Link to="/portfolio" className="hover:text-accent transition-colors">Projects</Link></li>
                            <li><Link to="/blog" className="hover:text-accent transition-colors">Blog</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-300 mb-3">Connect</h4>
                        <div className="flex gap-4">
                            <a href="https://github.com/Bereket613" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                               className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-accent hover:text-white transition-all duration-300">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href="https://www.linkedin.com/in/bereket-getaw-904857323/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                               className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-accent hover:text-white transition-all duration-300">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="https://x.com/BereketGetaw" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
                               className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-accent hover:text-white transition-all duration-300">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://www.instagram.com/_beek1one/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                               className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700 hover:bg-accent hover:text-white transition-all duration-300">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Bereket Getaw. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link>
                        <span>|</span>
                        <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;