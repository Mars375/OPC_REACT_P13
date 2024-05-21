/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'custom': '920px', // Ajoute une nouvelle taille de media query nommée 'custom'
      },
      fontFamily: {
        sans: ['Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: '#2c3e50',
        border: '#00bc77',
      },
    },
  },
  plugins: [],
}