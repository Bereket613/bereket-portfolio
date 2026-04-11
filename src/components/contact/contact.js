import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api';
import Button from '../ui/Button';
import emailjs from '@emailjs/browser';

const countries = ["Ethiopia", "USA", "UK", "Germany", "India", "Japan", "Canada", "Other"];

const Contact = ({ onClose }) => {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    country: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: `${formData.fname} ${formData.lname}`,
        email: formData.country, 
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
      
      toast.success("✅ Message sent successfully!");
      setFormData({ fname: '', lname: '', country: '', subject: '', message: '' });
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      toast.error("❌ Message failed to send.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
      <ToastContainer position="bottom-right" />
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-lg w-full shadow-2xl relative border border-gray-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button 
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors" 
            onClick={onClose}
        >
            <i className="fas fa-times text-lg"></i>
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Get in Touch</h2>
          <p className="text-gray-600 dark:text-gray-400">Have a project, collaboration, or opportunity? I'd love to hear from you.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <input 
                type="text" 
                name="fname" 
                id="fname"
                value={formData.fname}
                onChange={handleChange}
                required 
                placeholder=" "
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all peer text-gray-900 dark:text-white"
              />
              <label htmlFor="fname" className="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:text-accent -top-2.5 text-xs bg-white dark:bg-gray-800 px-1">First Name</label>
            </div>
            <div className="relative">
              <input 
                type="text" 
                name="lname" 
                id="lname"
                value={formData.lname}
                onChange={handleChange}
                required 
                placeholder=" "
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all peer text-gray-900 dark:text-white"
              />
              <label htmlFor="lname" className="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:text-accent -top-2.5 text-xs bg-white dark:bg-gray-800 px-1">Last Name</label>
            </div>
          </div>
          
          <div className="relative">
             {/* Adding Email field properly for valid database insertion */}
              <input 
                type="email" 
                name="country" 
                id="email"
                value={formData.country}
                onChange={handleChange}
                required 
                placeholder=" "
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all peer text-gray-900 dark:text-white"
              />
              <label htmlFor="email" className="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:text-accent -top-2.5 text-xs bg-white dark:bg-gray-800 px-1">Email Address</label>
          </div>

          <div className="relative">
              <input 
                type="text" 
                name="subject" 
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder=" "
                className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all peer text-gray-900 dark:text-white"
              />
              <label htmlFor="subject" className="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:text-accent -top-2.5 text-xs bg-white dark:bg-gray-800 px-1">Subject (Optional)</label>
          </div>

          <div className="relative">
            <textarea 
              name="message" 
              id="message"
              value={formData.message}
              onChange={handleChange}
              required 
              rows="4"
              placeholder=" "
              className="block w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all peer text-gray-900 dark:text-white resize-y min-h-[120px]"
            ></textarea>
            <label htmlFor="message" className="absolute left-4 top-3 text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:text-accent -top-2.5 text-xs bg-white dark:bg-gray-800 px-1">Your Message</label>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3 text-lg flex justify-center items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
            ) : (
              <><i className="fas fa-paper-plane"></i> Send Message</>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
