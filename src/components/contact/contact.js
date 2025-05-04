

import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './contact.css';

const countries = [ "Ethiopia", "USA", "UK", "Germany", "India", "Japan", "Canada" ];

const Contact = ({ onClose }) => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs.sendForm(
      'service_m0tdp4e',
      'template_x63wnkr',
      form.current,
      'rwhc3kE_cMveAdY5Z'
    )
    .then(() => {
      toast.success("✅ Message sent successfully!");
      form.current.reset();
      onClose();
    }, (error) => {
      toast.error("❌ Message failed to send.");
      console.error(error.text);
    });
  };

  return (
    <div className="contact-container">
      <ToastContainer />
      <motion.div
        className="contact-card"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="contact-header">
        <h1>Contact Me</h1>
        <p>If you have a project, collaboration, or opportunity you'd like to discuss, feel free to reach out.</p>

        </div>
        <form ref={form} onSubmit={sendEmail} className="contact-form">
          <div className="form-row">
            <div className="input-group">
              <input type="text" name="fname" required />
              <label>First Name</label>
            </div>
            <div className="input-group">
              <input type="text" name="lname" required />
              <label>Last Name</label>
            </div>
          </div>
          <div className="input-group">
            <select name="country" required>
              <option value="">Select your country</option>
              {countries.map((c, i) => (
                <option key={i} value={c}>{c}</option>
              ))}
            </select>
            <label>Country</label>
          </div>
          <div className="input-group">
            <textarea name="message" required></textarea>
            <label>Your Message</label>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">Send Message</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
