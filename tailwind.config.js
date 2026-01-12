/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0a0a1a',
          800: '#1a1a2e',
          700: '#16213e',
          600: '#0f3460',
          500: '#533483',
        }
      }
    },
  },
  plugins: [],
}
