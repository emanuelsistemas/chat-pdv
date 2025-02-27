/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
      },
      colors: {
        dark: {
          100: '#121212',
          200: '#1a1a1a',
          300: '#242424',
          400: '#2d2d2d',
          500: '#353535',
        },
        accent: {
          100: '#80b3ff',
          200: '#4d94ff',
          300: '#1a75ff',
          400: '#0066ff',
          500: '#0052cc',
        }
      },
      boxShadow: {
        'input': '0 2px 5px rgba(0, 0, 0, 0.08)',
        'input-focus': '0 2px 10px rgba(0, 0, 0, 0.12), 0 0 0 2px rgba(26, 117, 255, 0.3)',
      },
      animation: {
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce': 'bounce 2s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(-25%)', 
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': { 
            transform: 'translateY(0)', 
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
      },
    },
  },
  plugins: [],
}
