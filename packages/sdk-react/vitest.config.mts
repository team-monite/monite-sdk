import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.png$': path.resolve(__dirname, './src/mocks/fileMock.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    root: __dirname,
    setupFiles: ['./vitest.setup.ts', '@testing-library/jest-dom/vitest'],
    retry: process.env.CI ? 3 : 0,
    pool: 'threads',
    watch: false,
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    isolate: true,
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
