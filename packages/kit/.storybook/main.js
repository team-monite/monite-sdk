const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    {
      name: '@storybook/preset-ant-design',
      options: {
        lessOptions: {
          modifyVars: {
            'ant-prefix': 'monite',
            'primary-color': '#246FFF',
            'error-color': '#FF475D',
          },
        },
      },
    },
  ],
  framework: '@storybook/react',
  webpackFinal: async (config) => {
    config.resolve.modules = [
      ...(config.resolve.modules || []),
      path.resolve(__dirname, '../src'),
    ];

    return config;
  },
};
