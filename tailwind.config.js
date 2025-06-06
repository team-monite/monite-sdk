/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./packages/*/src/**/*.{js,jsx,ts,tsx}",
    "./examples/*/src/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./packages/*/src/**/*.css",
    "./examples/*/src/**/*.css"
  ],
  
  plugins: [
    require("@tailwindcss/typography"),
  ],
}; 