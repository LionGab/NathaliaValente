/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        peanut: {
          coral: '#FF6B6B',
          'coral-light': '#FE9797',
          'coral-lighter': '#FFB5B5',
          peach: '#FFD4C8',
          cream: '#FFF9F5',
          sand: '#F5F1ED',
          gray: {
            50: '#FAFAFA',
            100: '#F5F5F5',
            200: '#E8E8E8',
            300: '#D1D1D1',
            400: '#A8A8A8',
            500: '#7A7A7A',
            600: '#5C5C5C',
            700: '#3F3F3F',
            800: '#2B2B2B',
            900: '#1A1A1A',
          },
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'peanut-sm': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'peanut': '0 4px 16px rgba(0, 0, 0, 0.06)',
        'peanut-lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
};
