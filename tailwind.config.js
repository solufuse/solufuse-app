
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background-light)',
        text: 'var(--text-light)',
        primary: 'var(--primary-color)',
        border: 'var(--border-light)',
        card: 'var(--card-light)',
        sidebar: 'var(--sidebar-light)',
        dark: {
          background: 'var(--background-dark)',
          text: 'var(--text-dark)',
          border: 'var(--border-dark)',
          card: 'var(--card-dark)',
          sidebar: 'var(--sidebar-dark)',
        }
      }
    },
  },
  plugins: [],
}
