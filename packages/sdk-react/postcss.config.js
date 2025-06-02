const postcssImport = require('postcss-import');
const tailwindcssNesting = require('tailwindcss/nesting');
const postcssNested = require('postcss-nested');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    postcssImport,
    tailwindcssNesting,
    postcssNested,
    tailwindcss,
    autoprefixer,
  ],
};
