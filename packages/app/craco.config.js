const path = require('path');
const cracoBabelLoader = require('craco-babel-loader');

const resolvePackage = (relativePath) => path.resolve(__dirname, relativePath);
module.exports = {
  plugins: [
    {
      plugin: cracoBabelLoader,
      options: {
        includes: [resolvePackage('../kit')],
        excludes: [/node_modules/],
      },
    },
  ],
};
