import type { StorybookConfig } from '@storybook/react-webpack5';

import * as path from 'path';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@storybook/addon-styling',
    '@storybook/addon-storysource',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    };

    return config;
  },
  babel: async (options) => ({
    ...options,
    presets: [
      ...options.presets,
      // HACK: Storybook includes `@babel/preset-react` by default, which
      // overrides the custom preset configuration in `babel.config.json`.
      // This override overrides the override.
      [
        '@babel/preset-react',
        { runtime: 'automatic', importSource: '@emotion/react' },
        'preset-jsx-import-source',
      ],
    ],
  }),
};
export default config;
