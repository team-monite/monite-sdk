module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/postcss': {
      content: [
        './packages/*/src/**/*.{js,jsx,ts,tsx,css}',
        './examples/*/src/**/*.{js,jsx,ts,tsx,css}',
        './src/**/*.{js,jsx,ts,tsx,css}',
      ],
    },
    'postcss-nested': {
      preserveEmpty: true,
    },
    'autoprefixer': {},
  },
};