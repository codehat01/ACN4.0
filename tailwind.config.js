/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'custom-burgundy': '#b22049',
    deepNavy: '#0F172A', // Main brand, headers, navigation
    royalBlue: '#1E40AF', // Links, buttons, accents
    elegantGold: '#D97706', // Premium accents, highlights
    emeraldGreen: '#059669', // Success states, trust indicators
    pureWhite: '#FFFFFF', // Clean backgrounds
    platinumGray: '#F8FAFC', // Subtle backgrounds
    charcoal: '#374151', // Professional text
    midnight: '#111827', // Strong contrast text
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      boxShadow: {
        'xl-accent': '0 20px 25px -5px rgba(194, 166, 70, 0.1), 0 10px 10px -5px rgba(194, 166, 70, 0.04)',
        'xl-primary': '0 20px 25px -5px rgba(178, 32, 73, 0.1), 0 10px 10px -5px rgba(178, 32, 73, 0.04)',
      },
    },
  },
  plugins: [],
};