import react from '@vitejs/plugin-react';

import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  root: __dirname, // Explicitly set root
  plugins: [
    react({
      babel: {
        plugins: [
          ['@emotion/babel-plugin', { sourceMap: true, autoLabel: 'dev-only' }],
        ],
      },
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, 'src'),
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  ssr: {
    noExternal: ['vite-tsconfig-paths'],
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    root: __dirname,
    setupFiles: ['./vitest.setup.ts'],
    retry: process.env.CI ? 3 : 0,
    pool: 'forks',
    watch: false,
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    isolate: true,
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**',
      '**/*.e2e.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      '**/*.playwright.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
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
        '!src/mocks/**/*.{js,jsx,ts,tsx}',
      ],
      // Removed specific thresholds for now
    },
  },
});
