/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.css"],
  plugins: [require("@tailwindcss/typography")],
  
  theme: {
    extend: {
      colors: {
        gray: {
          300: "#d1d5db",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        }
      }
    }
  },
  
  corePlugins: {
    preflight: true,
  },
};
