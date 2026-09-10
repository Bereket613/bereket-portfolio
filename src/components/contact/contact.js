import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import Button from '../ui/Button';
import emailjs from '@emailjs/browser';

const Contact = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    let cancelled = false;
    api.get('/api/profile')
      .then(res => { if (!cancelled) setProfile(res.data || {}); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: `${formData.fname} ${formData.lname}`.trim(),
        email: formData.email,
        subject: formData.subject || 'Portfolio Contact',
        message: formData.message
      };

      // Save to database first
      await api.post('/api/messages', payload);

      // Setup emailjs
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: payload.name,
            from_email: payload.email,
            subject: payload.subject,
            message: payload.message,
          },
          publicKey
        );
      } else {
        console.warn("EmailJS credentials not configured in .env, skipping email notification.");
      }

      toast.success("Message sent successfully. I will get back to you soon.");
      setFormData({ fname: '', lname: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("Message failed to send. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "block w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-accent focus:border-transparent focus:outline-none transition-shadow text-sm";

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="Contact form">
      <ToastContainer position="bottom-right" />
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-lg p-8 max-w-lg w-full shadow-xl border border-slate-200 dark:border-slate-800 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.15 }}
      >
        <button
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Close contact form"
        >
            <i className="fas fa-times text-lg"></i>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Get in Touch</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Have a project, collaboration, or opportunity? Send me a message.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="fname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
              <input
                type="text"
                name="fname"
                id="fname"
                value={formData.fname}
                onChange={handleChange}
                required
                autoComplete="given-name"
                placeholder="First name"
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="lname" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
              <input
                type="text"
                name="lname"
                id="lname"
                value={formData.lname}
                onChange={handleChange}
                required
                autoComplete="family-name"
                placeholder="Last name"
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subject <span className="text-slate-400 font-normal">(optional)</span></label>
            <input
              type="text"
              name="subject"
              id="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What is this about?"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              placeholder="Your message..."
              className={`${inputClasses} resize-y min-h-[120px]`}
            ></textarea>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" aria-label="Sending"></span>
            ) : (
              <><i className="fas fa-paper-plane text-sm"></i> Send Message</>
            )}
          </Button>
        </form>

        {/* Direct contact channels */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-teal-400 transition-colors">
              <i className="fas fa-envelope"></i>
              <span className="text-xs font-medium">Email</span>
            </a>
          )}
          {profile.linkedin && (
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-teal-400 transition-colors">
              <i className="fab fa-linkedin"></i>
              <span className="text-xs font-medium">LinkedIn</span>
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-accent dark:hover:text-teal-400 transition-colors">
              <i className="fab fa-github"></i>
              <span className="text-xs font-medium">GitHub</span>
            </a>
          )}
          <div className="flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400">
            <i className="fas fa-location-dot"></i>
            <span className="text-xs font-medium">{profile.location || 'Addis Ababa, Ethiopia'}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
