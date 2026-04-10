/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'green-primary': '#1B5E20',
        'green-secondary': '#2E7D32',
        'teal-accent': '#38B2AC',
        'gold-accent': '#F9C74F',
        'gold-dark': '#B8860B',
        'dark-green': '#0D2B0D',
      },
      fontFamily: {
        'ethiopic': ['"Noto Sans Ethiopic"', 'sans-serif'],
        'sans': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      maxWidth: {
        'content': '1100px',
      },
    },
  },
  plugins: [],
}
