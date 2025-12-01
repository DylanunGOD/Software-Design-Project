/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2ECC71',
        secondary: '#34495E',
        accent: '#F1C40F',
        neutral: '#ECF0F1',
        neutralDark: '#95A5A6',
        tier: '#2ECC71',
        lime: '#A7E815',
        bird: '#000000',
        error: '#E74C3C',
        success: '#27AE60',
        info: '#3498DB',
      },
      animation: {
        'pulse-marker': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      boxShadow: {
        'panel': '0 -4px 20px rgba(0, 0, 0, 0.15)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
