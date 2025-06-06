/** @type {import("tailwindcss").Config} */
module.exports = {
  extends: '../../tailwind.config.js',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/sdk-react/src/**/*.{js,jsx,ts,tsx}',
    '../../packages/sdk-demo/src/**/*.{js,jsx,ts,tsx}',
  ],
};
