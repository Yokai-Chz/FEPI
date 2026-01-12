/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'guinda': '#691C32',
        'dorado': '#BC955C',
      },
    },
  },
  plugins: [],
}