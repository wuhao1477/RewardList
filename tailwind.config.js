/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#FF8B8B',
          200: '#FF7B7B',
          300: '#FF6B6B'
        },
        primary: {
          DEFAULT: '#D84C6F',
          200: '#C23D62',
          300: '#AB2955'
        },
        accent: {
          DEFAULT: '#FF4D6B',
          200: '#E63D5B'
        },
        text: {
          DEFAULT: '#FFFFFF',
          200: '#F8F8F8'
        }
      }
    },
  },
  plugins: [],
} 