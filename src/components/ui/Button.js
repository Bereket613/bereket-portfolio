import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', as = 'button', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent text-white hover:bg-accentDark",
    secondary: "bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-accent hover:text-accent dark:hover:text-accent",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "bg-transparent text-slate-600 hover:text-accent dark:text-slate-400 dark:hover:text-slate-200"
  };

  const MotionComponent = as === 'a' ? motion.a : motion.button;

  return (
    <MotionComponent
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default Button;
