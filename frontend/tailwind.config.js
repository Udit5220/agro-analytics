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
        // ── GreenLeaf Brand Palette ──
        'brand-darkest':  'var(--brand-darkest, #1b5e20)', // Forest Green (Text/Icons)
        'brand-dark':     'var(--brand-dark, #50C878)', // Emerald Green (Hover BG)
        'brand-medium':   'var(--brand-medium, #D0F0C0)', // Tea Green (Active/Click)
        'brand-light':    'var(--brand-light, #a5d6a7)', // Light Sage
        'brand-accent':   'var(--brand-accent, #D0F0C0)', // Tea Green
        'brand-lightest': 'var(--brand-lightest, #71BC78)', // Fern Green (Sidebar/Navbar BG)

        // ── Semantic Status Colors ──
        'theme-positive': 'var(--theme-positive, #D0F0C0)',
        'theme-negative': 'var(--theme-negative, #cc5555)',
        'theme-neutral':  'var(--theme-neutral, #d3d3d3)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        // Greenleaf glass-card shadow
        'glass': '0px 0px 4px 0px rgba(0,0,0,0.5)',
        'glass-sm': '0px 0px 4px 0px rgba(0,0,0,0.12)',
        'glass-hover': '0px 0px 10px 0px rgba(0,0,0,0.18)',
      },
    },
  },
  plugins: [],
}
