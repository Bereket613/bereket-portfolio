import React from 'react';
import './footer.css'; // Changed from './footer' to './footer.css'

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <p>© {new Date().getFullYear()} Bereket Getaw. All rights reserved.</p>
                <div className="footer-links">
                    <a href="/terms" className="footer-link">Terms of Service</a>
                    <span className="divider">|</span>
                    <a href="/privacy" className="footer-link">Privacy Policy</a>
                </div>
                <div className="social-media">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://x.com/BereketGetaw" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com/_beek1one/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/bereket-getaw-904857323/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;