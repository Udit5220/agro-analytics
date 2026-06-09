/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/seed-json/seededData.json",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-darkest': '#132a13',
        'brand-dark': '#31572c',
        'brand-medium': '#4f772d',
        'brand-light': '#90a955',
        'brand-accent': '#ecf39e',
        'brand-lightest': '#f4f7f4',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
