import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import emailjs from '@emailjs/browser';

const GITHUB_URL = 'https://github.com/Bereket613';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email,
        subject: formData.subject || 'Portfolio Contact',
        message: formData.message
      };

      // Save to database first
      await api.post('/api/messages', payload);

      // Send email notification if EmailJS is configured
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
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error("Message failed to send. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = "block w-full px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-accent focus:border-transparent focus:outline-none transition-shadow text-sm";

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <ToastContainer position="bottom-right" />
      <section className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Contact</h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mt-8">
          {/* Left: contact information */}
          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Let's work together</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 leading-relaxed text-[15px]">
              Have a project, role, or research collaboration in AI/ML? Send me a message and I'll get
              back to you.
            </p>

            <ul className="mt-8 space-y-4 text-[15px]">
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-accent dark:hover:text-teal-400 transition-colors"
                >
                  <i className="fab fa-github text-lg w-5 text-center"></i>
                  <span className="font-mono text-sm">github.com/Bereket613</span>
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <i className="fas fa-location-dot text-lg w-5 text-center text-slate-400"></i>
                <span className="text-sm">Addis Ababa, Ethiopia</span>
              </li>
            </ul>
          </motion.div>

          {/* Right: form */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            {submitted ? (
              <div className="bg-white dark:bg-slate-900 rounded-lg p-8 border border-slate-200 dark:border-slate-800 text-center">
                <i className="fas fa-check-circle text-3xl text-accent dark:text-teal-400"></i>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mt-4">Message sent</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                  Thanks for reaching out — I'll get back to you soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-sm font-medium text-accent dark:text-teal-400 hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-lg p-6 md:p-8 border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Name</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={inputClasses}
                    />
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
                </div>

                <div className="mt-5">
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

                <div className="mt-5">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Message</label>
                  <textarea
                    name="message"
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Your message..."
                    className={`${inputClasses} resize-y`}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium bg-accent text-white hover:bg-accentDark transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
                >
                  {isSubmitting ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white/40 border-t-white" aria-label="Sending"></span>
                  ) : (
                    <><i className="fas fa-paper-plane text-sm"></i> Send Message</>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
