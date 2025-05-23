/// <reference types="vitest" />
// import react from '@vitejs/plugin-react-swc'; // Old SWC-based plugin
import lingui from '@lingui/vite-plugin';
import react from '@vitejs/plugin-react';

// New Babel-based plugin
// import swc from 'unplugin-swc'; // Remove unplugin-swc
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// This is a minimal Vite config for sdk-react.
// It primarily serves to anchor Vitest to this package.
// We can extend it later if needed for specific Vite plugins for testing.

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  root: __dirname, // Explicitly set root
  optimizeDeps: {
    include: [], // Clearing this for now
  },
  plugins: [
    react({
      // Use Babel for transformation
      babel: {
        plugins: [
          '@lingui/babel-plugin-transform-js',
          'macros',
          ['@emotion/babel-plugin', { sourceMap: true, autoLabel: 'dev-only' }],
          // Note: We might need a more specific Lingui Babel plugin if 'macros' isn\'t enough
          // e.g., '@lingui/babel-plugin-transform-js' or ensure babel-plugin-macros handles it.
        ],
      },
    }),
    lingui({ cwd: __dirname }),
    tsconfigPaths(),
    // swc.vite({ // Remove unplugin-swc configuration
    //   jsc: {
    //     parser: {
    //       syntax: 'typescript',
    //       tsx: true,
    //     },
    //     transform: {
    //       react: {
    //         runtime: 'automatic',
    //       },
    //     },
    //   },
    //   sourceMaps: true,
    //   module: { type: 'es6' },
    // }),
  ],
  // Aliases defined here will be used by Vite for build/dev and Vitest
  // vite-tsconfig-paths should handle the @/ alias from tsconfig.json
  // We still need manual aliases for CSS and image mocks if not handled by Vite plugins
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, 'src'),
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.png$': path.resolve(__dirname, './src/mocks/fileMock.ts'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  test: {
    // Vitest specific configurations
    globals: true,
    environment: 'jsdom',
    root: __dirname, // Vitest also respects this root
    setupFiles: ['./vitest.setup.ts'],
    retry: process.env.CI ? 3 : 0,
    server: {
      deps: {
        inline: [
          '@testing-library/jest-dom',
          '@mui/material',
          '@emotion/react',
        ],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!src/components/payment/**/*.{js,jsx,ts,tsx}',
        '!src/core/i18n/**/*.{js,jsx,ts,tsx}',
        '!src/mocks/**/*.{js,jsx,ts,tsx}',
        '!src/utils/**/*.{js,jsx,ts,tsx}',
        '!src/api/services/**/*.{ts}',
        '!src/api/api-version.ts',
        '!src/api/create-api-client.ts',
        '!src/api/index.ts',
        '!src/api/schema.ts',
        '!**/node_modules/**',
      ],
      thresholds: {
        global: {
          lines: 58,
          functions: 32,
          branches: 34,
          statements: 58,
        },
        './src/components/tags': {
          branches: 80,
          functions: 70,
          lines: 90,
          statements: 90,
        },
        './src/components/counterparts': {
          branches: 70,
          functions: 75,
          lines: 80,
          statements: 80,
        },
        './src/components/payables': {
          branches: 15,
          functions: 25,
          lines: 55,
          statements: 55,
        },
        './src/components/products': {
          branches: 81,
          functions: 85,
          lines: 96,
          statements: 96,
        },
        './src/components/receivables': {
          branches: 30,
          functions: 25,
          lines: 60,
          statements: 55,
        },
      },
    },
  },
});
