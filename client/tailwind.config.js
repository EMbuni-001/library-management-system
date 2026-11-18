
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],

  // 'class' means dark mode is controlled by a "dark" class on the
  // html element, so the visitor can override their system setting.
  darkMode: 'class',

  theme: {
    extend: {},
  },
  plugins: [],
};