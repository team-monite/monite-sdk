const postcssConfig = {
  plugins: [
    require('postcss-import')(),
    require('postcss-nested')(),
  ],
};

module.exports = postcssConfig; 