import type { StorybookConfig } from '@storybook/react-vite';
import { createRequire } from 'node:module';
import * as path from 'path';
import { dirname, join } from 'path';

const require = createRequire(import.meta.url);

/** @type { import('@storybook/react-vite').StorybookConfig } */
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(tsx|mdx)'],
  addons: [getAbsolutePath('@storybook/addon-docs')],
  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      // Mock @lingui/macro for Storybook since it needs compile-time transformation
      '@lingui/macro': path.resolve(
        __dirname,
        '../src/__mocks__/lingui-macro.ts'
      ),
      // Mock CSS imports to prevent "does not provide an export named 'default'" errors
      '../app.css': path.resolve(__dirname, '../src/__mocks__/css-mock.ts'),
    };

    // Ensure proper TypeScript file resolution
    config.resolve.extensions = [
      '.mjs',
      '.js',
      '.mts',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
    ];

    // Configure optimizeDeps for proper module resolution
    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include || []), '@lingui/react'],
    };

    // Configure CSS handling for Tailwind and other styles
    config.css = {
      ...config.css,
      postcss: {
        plugins: [require('@tailwindcss/postcss')],
      },
    };

    // Configure server to handle file system access
    config.server = {
      ...config.server,
      fs: {
        ...config.server?.fs,
        allow: ['..', '/'],
        strict: false,
      },
    };

    return config;
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
