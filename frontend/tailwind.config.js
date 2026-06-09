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
        'brand-darkest': 'var(--brand-darkest)',
        'brand-dark': 'var(--brand-dark)',
        'brand-medium': 'var(--brand-medium)',
        'brand-light': 'var(--brand-light)',
        'brand-accent': 'var(--brand-accent)',
        'brand-lightest': 'var(--brand-lightest)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
