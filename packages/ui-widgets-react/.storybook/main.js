const path = require('path');

module.exports = {
  devtool: 'source-map',
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
  ],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../src'),
    ];

    return config;
  },
  core: {
    builder: 'webpack5',
    disableTelemetry: true,
  },
};
