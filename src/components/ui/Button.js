import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', as = 'button', ...props }) => {
  const baseStyles = "relative overflow-hidden px-8 py-3.5 rounded-full font-bold tracking-wide transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 dark:focus:ring-offset-slate-900 inline-flex items-center justify-center gap-2 group z-10 glass-override";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent to-accentDark text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_35px_rgba(124,58,237,0.7)] border border-white/10 dark:border-white/5 focus:ring-accent/50",
    secondary: "bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 hover:text-white dark:hover:text-white hover:border-accentDark/50 hover:bg-gradient-to-r hover:from-accent hover:to-accentDark shadow-xl hover:shadow-[0_0_25px_rgba(79,70,229,0.4)]",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)] hover:shadow-[0_0_25px_rgba(225,29,72,0.6)] border border-white/10 focus:ring-red-500/50",
    ghost: "bg-transparent shadow-none border-transparent text-slate-600 hover:text-accent dark:text-slate-400 dark:hover:text-accentDark hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
  };

  const MotionComponent = as === 'a' ? motion.a : motion.button;

  // Using a custom base style if it's primary or secondary to avoid conflicts
  const buttonClass = className.includes('glass') ? className : className;

  return (
    <MotionComponent 
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${baseStyles} ${variants[variant]} ${buttonClass}`}
      {...props}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 w-full h-full bg-white/10 group-hover:bg-white/20 blur-[2px] transition-all duration-300 -z-10 rounded-full" />
      )}
      {children}
    </MotionComponent>
  );
};

export default Button;
