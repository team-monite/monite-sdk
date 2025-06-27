import react from '@vitejs/plugin-react';

import { resolve } from 'node:path';
import { defineConfig, ConfigEnv } from 'vite';

export default async function viteConfig({ mode }: ConfigEnv) {
  return defineConfig({
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      global: 'globalThis',
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    optimizeDeps: {
      exclude: [
        '@monite/sdk-react',
        'jiti',
        'perf_hooks',
        'acorn',
        'gulp-sourcemaps',
        'cosmiconfig',
      ],
    },
    build: {
      sourcemap: true,
      target: 'es2020',
      lib: {
        formats: ['cjs', 'es'], // order is important, cjs first, es second
        entry: {
          'monite-iframe-app.html': resolve(
            __dirname,
            'monite-iframe-app.html'
          ),
          'monite-iframe-app-demo.html': resolve(
            __dirname,
            'monite-iframe-app-demo.html'
          ),
          'monite-iframe-app-drop-in-demo.html': resolve(
            __dirname,
            'monite-iframe-app-drop-in-demo.html'
          ),
          'monite-app-demo.html': resolve(__dirname, 'monite-app-demo.html'),
          'monite-app': resolve(__dirname, 'src/custom-elements/monite-app.ts'),
          'monite-iframe-app': resolve(
            __dirname,
            'src/custom-elements/monite-iframe-app.ts'
          ),
          'monite-iframe-app-communicator': resolve(
            __dirname,
            'src/lib/MoniteIframeAppCommunicator.ts'
          ),
        },
        name: 'Monite Drop-in',
      },
      rollupOptions: {
        external: [],
        output: {
          globals: {},
        },
      },
    },
  });
} 