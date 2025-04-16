import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@storybook/addon-themes',
    '@storybook/addon-storysource',
  ],

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  staticDirs: ['../public'],

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },

  webpackFinal: async (config) => {
    if (!config.resolve) {
      config.resolve = { alias: {} };
    }
    
    if (!config.resolve.alias) {
      config.resolve.alias = {};
    }

    // Add path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    // Ensure TypeScript files are processed by babel-loader with specific config
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve('babel-loader'),
      options: {
        babelrc: false, // Don't look for .babelrc files
        configFile: false, // Don't look for babel.config.js files
        presets: [
          require.resolve('@babel/preset-env'),
          [require.resolve('@babel/preset-react'), { runtime: 'automatic', importSource: '@emotion/react' }],
          require.resolve('@babel/preset-typescript'),
        ],
        plugins: [
          [require.resolve('@babel/plugin-transform-runtime'), { regenerator: true }],
          require.resolve('@emotion/babel-plugin'),
          require.resolve('babel-plugin-macros'),
        ],
      },
      exclude: /node_modules/,
    });

    // Remove potential default JS rule added by Storybook that might conflict
    // Note: This might need adjustment based on Storybook version/exact default config
    // config.module.rules = config.module.rules.filter(
    //   rule => rule.test && !(rule.test.toString().includes('js') || rule.test.toString().includes('ts'))
    // );

    return config;
  },
};

export default config;
