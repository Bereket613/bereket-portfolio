import React from 'react';
import background from '../../assets/image.png';
import './intro.css';

const Intro = ({ onContactClick }) => {
  return (
    <section id="intro">
      <div className="introContent">
        <span className="hello">Hello</span>
        <span className="introText">
          I am <span className="introName">Bereket</span>
          <br />
          a Data Scientist
        </span>
        <p className="introParagraph">
          I am a skilled data scientist with experience in <br/>machine learning and AI development.
        </p>
        <button className="button" onClick={onContactClick}>Contact</button>
      </div>
      <img src={background} alt="profile" className="background" />
    </section>
  );
};

export default Intro;