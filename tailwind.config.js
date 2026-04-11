/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'selector',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#4f46e5',
        accentDark: '#7c3aed',
        primary: '#0f172a',
        secondary: '#1e293b',
      },
      animation: {
        blob: 'blob 7s infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite alternate',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          from: { boxShadow: '0 0 10px #4f46e5, 0 0 20px #4f46e5' },
          to: { boxShadow: '0 0 20px #7c3aed, 0 0 30px #7c3aed' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        }
      }
    },
  },
  plugins: [],
}
