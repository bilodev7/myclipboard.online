/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6', // Vibrant purple
        secondary: '#10B981', // Emerald green
        accent: '#F59E0B', // Amber
        background: {
          DEFAULT: '#121212', // Dark background
          alt: '#1E1E1E', // Slightly lighter dark background
        },
        surface: {
          DEFAULT: '#1E1E1E', // Card background
          hover: '#2D2D2D', // Hover state
          active: '#333333', // Active state
        },
        text: {
          primary: '#FFFFFF', // White text
          secondary: '#A3A3A3', // Gray text
          accent: '#8B5CF6', // Purple text
        },
        error: '#EF4444',
        success: '#10B981',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 15px rgba(139, 92, 246, 0.5)', // Purple glow effect
        'glow-sm': '0 0 8px rgba(139, 92, 246, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'slideUpIn': 'slideUpIn 0.3s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'linear-gradient(to right, #8B5CF6, #3B82F6, #10B981)',
      },
    },
  },
  plugins: [],
};
