/// <reference types="vitest" />
import linguiPlugin from '@lingui/vite-plugin';
import reactSWC from '@vitejs/plugin-react-swc';

import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  root: __dirname,
  optimizeDeps: {
    include: [],
  },
  plugins: [
    reactSWC({
      jsxImportSource: '@emotion/react',
      tsDecorators: true,
    }),
    linguiPlugin({ cwd: __dirname }),
    tsconfigPaths(),
  ],
  define: {
    'process.env.ENABLE_SENTRY': JSON.stringify(process.env.ENABLE_SENTRY),
  },
  resolve: {
    alias: {
      '@/': path.resolve(__dirname, 'src'),
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '\\.png$': path.resolve(__dirname, './src/mocks/fileMock.ts'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  ssr: {
    noExternal: ['vite-tsconfig-paths'],
  },
});
