/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'max-md': { 'max': '767px' }, // Define um breakpoint máximo para telas menores que 768px
      },
    },
  },
  plugins: [],
}
