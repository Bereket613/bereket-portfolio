import React from 'react';
import './terms.css';

const Terms = () => (
  <div className="terms-container">
    <div className="terms-content">
      <div className="terms-header">
        <h2>Terms of Service</h2>
      </div>
      
      <div className="terms-section">
        <h3>1. Acceptance of Terms</h3>
        <p>
          These Terms of Service govern your use of my portfolio website. By accessing it, 
          you agree to be bound by these terms. If you disagree with any part of the terms, 
          you may not access the service.
        </p>
      </div>
      
      <div className="terms-section">
        <h3>2. Intellectual Property</h3>
        <p>
          All content on this website, including but not limited to text, graphics, logos, 
          and images, is my property and protected by copyright laws.
        </p>
      </div>
      
      <div className="terms-section">
        <h3>3. User Responsibilities</h3>
        <ul className="terms-list">
          <li>You agree not to reproduce, duplicate, copy or exploit any portion of the service</li>
          <li>You must not conduct any systematic or automated data collection activities</li>
          <li>You must not use this website in any way that causes damage or impairment</li>
        </ul>
      </div>
      
      {/* Add more sections as needed */}
    </div>
  </div>
);

export default Terms;