// src/components/experience/Experience.jsx
import React from 'react';
import './experience.css';

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="experience-content">
        <h2 className="experience-title">Experience</h2>
        <div className="experience-items">

          <div className="experience-card">
            <h3>Member & Contributor – Techtonic Tribe Tech Club</h3>
            <p><strong>Debre Berhan University</strong></p>
            <p>
              Actively participate in tech meetups, workshops, and collaborative coding sessions.
              Contributed to multiple hackathons and group projects focusing on:
            </p>
            <ul>
              <li>Frontend development using HTML, CSS, JavaScript, and React</li>
              <li>Python scripting and mini automation tasks</li>
            </ul>
            <p>Earned certificates of recognition for contributions in all three technologies.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Experience;
