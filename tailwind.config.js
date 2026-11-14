/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: 'rgb(var(--brand-navy-rgb) / <alpha-value>)',
          red: 'rgb(var(--brand-red-rgb) / <alpha-value>)',
          white: 'rgb(var(--brand-white-rgb) / <alpha-value>)',
        },
        whatsapp: {
          DEFAULT: '#128C4A',
          dark: '#0E7039',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(178, 34, 52, 0.55)' },
          '70%, 100%': { boxShadow: '0 0 0 14px rgba(178, 34, 52, 0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
