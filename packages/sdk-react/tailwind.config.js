/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './src/**/*.css'],
  plugins: [require('@tailwindcss/typography')],
  
  corePlugins: {
    preflight: true,
  },
};
