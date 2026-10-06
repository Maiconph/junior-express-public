/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#1E3A8A',
          darkBlue: '#0F172A',
          red: '#DC2626',
          softRed: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}
