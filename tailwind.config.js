
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#141420',
        primary: {
          DEFAULT: '#00D4AA', // Teal
          glow: 'rgba(0, 212, 170, 0.5)',
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber
          glow: 'rgba(245, 158, 11, 0.5)',
        },
        danger: {
          DEFAULT: '#EF4444', // Coral
          glow: 'rgba(239, 68, 68, 0.5)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 10px rgba(0, 212, 170, 0.3), 0 0 20px rgba(0, 212, 170, 0.1)',
        'glow-amber': '0 0 10px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.1)',
        'glow-coral': '0 0 10px rgba(239, 68, 68, 0.3), 0 0 20px rgba(239, 68, 68, 0.1)',
      }
    },
  },
  plugins: [],
}
