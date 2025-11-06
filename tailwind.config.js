/** @type {import('tailwindcss').Config} */
export default {
  // Tailwind 4 usa CSS variables e @import
  // Configuração simplificada - cores e temas no CSS
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      // Cores customizadas serão definidas via CSS variables no index.css
      // Tailwind 4 suporta melhor CSS variables nativas
    },
  },
  plugins: [],
};
