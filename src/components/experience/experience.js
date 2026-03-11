import React from 'react';
import './experience.css';
import { experienceData } from '../../data/portfolioData';

const Experience = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="experience-content">
        <h2 className="experience-title">Experience</h2>
        <div className="experience-items">
          {experienceData.map((item, index) => (
            <div key={index} className="experience-card">
              <h3>{item.title}</h3>
              <p><strong>{item.subtitle}</strong></p>
              <p>{item.description}</p>
              {item.points && (
                <ul>
                  {item.points.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              )}
              {item.footer && <p>{item.footer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
