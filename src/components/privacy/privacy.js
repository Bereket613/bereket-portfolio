import React from 'react';
import './privacy.css';

const Privacy = () => (
  <div className="privacy-container">
    <div className="privacy-content">
      <div className="privacy-header">
        <h2>Privacy Policy</h2>
      </div>
      
      <div className="privacy-section">
        <h3>1. No Personal Data Collection</h3>
        <p>
          This website does not collect, store, or share any personal data such as your name, 
          email, IP address, or browsing activity. As a data science portfolio, it serves 
          purely as an informational showcase of my work.
        </p>
      </div>
      
      <div className="privacy-section">
        <h3>2. External Services</h3>
        <p>
          The site may include:
        </p>
        <ul className="privacy-list">
          <li>Embedded GitHub project links</li>
          <li>Links to external data science resources</li>
          <li>Third-party documentation references</li>
        </ul>
        <p>
          These services have their own privacy policies that I do not control.
        </p>
      </div>
      
      <div className="privacy-section">
        <h3>3. Cookies & Tracking</h3>
        <p>
          This site does not use:
        </p>
        <ul className="privacy-list">
          <li>Cookies</li>
          <li>Analytics tracking</li>
          <li>Behavioral tracking technologies</li>
        </ul>
        <p>
          Your visit is completely anonymous and untracked.
        </p>
      </div>
      
      <div className="privacy-section">
        <h3>4. Policy Changes</h3>
        <p>
          Any updates to this privacy policy will be posted here with a new effective date. 
          The current version was last updated on April 30, 2025.
        </p>
      </div>
      
      <div className="privacy-section">
        <h3>5. Contact</h3>
        <p>
          For any privacy-related questions about this data science portfolio, 
          please contact me through the information provided in my contact section.
        </p>
      </div>
    </div>
  </div>
);

export default Privacy;