/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF0000', // red
          light: '#FF3333',
          dark: '#CC0000',
        },
        secondary: {
          DEFAULT: '#333333', // dark gray
          light: '#666666',
          dark: '#111111', // almost black
        },
        light: {
          DEFAULT: '#FFFFFF', // white
          gray: '#F5F5F5',
          dark: '#E5E5E5', // light gray
        }
      },
    },
  },
  plugins: [],
}
