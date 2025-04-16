import { lingui } from '@lingui/vite-plugin';
import react from '@vitejs/plugin-react';

import path from 'path';
import { defineConfig } from 'vite';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin', 'macros'],
      },
    }),
    lingui(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    // Enable CSS modules for all CSS files
    modules: {
      localsConvention: 'camelCase',
    },
  },
});
