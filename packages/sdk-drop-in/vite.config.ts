import react from '@vitejs/plugin-react';

import { resolve } from 'node:path';
import { defineConfig, ConfigEnv } from 'vite';

export default async function viteConfig({ mode }: ConfigEnv) {
  return defineConfig({
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env': {},
      'process.version': '""',
      'process.versions': { node: '""' },
      'process.platform': '"browser"',
      'process.stdout': {
        fd: 1,
        isTTY: false,
        getColorDepth: () => 4,
        hasColors: () => false,
        write: () => true,
      },
      'process.stderr': {
        fd: 2,
        isTTY: false,
        getColorDepth: () => 4,
        hasColors: () => false,
        write: () => true,
      },
      'process.stdin': { fd: 0, isTTY: false },
      global: 'window',
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
      }),
    ],
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'react/jsx-dev-runtime',
      ],
      exclude: [
        '@monite/sdk-react',
        'jiti',
        'perf_hooks',
        'acorn',
        'gulp-sourcemaps',
        'cosmiconfig',
      ],
    },
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
        // React module aliases (more specific patterns first)
        {
          find: /^react$/,
          replacement: 'react',
        },
        {
          find: /^react\/jsx-runtime$/,
          replacement: 'react/jsx-runtime',
        },
        {
          find: /^react\/jsx-dev-runtime$/,
          replacement: 'react/jsx-dev-runtime',
        },
        {
          find: /^react-dom$/,
          replacement: 'react-dom',
        },
      ],
    },
    build: {
      sourcemap: true,
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
        external: (id) => {
          const nodeModules = [
            'fs',
            'path',
            'os',
            'util',
            'stream',
            'tty',
            'crypto',
            'http',
            'https',
            'buffer',
            'canvas',
            'jsdom',
            'react',
            'react-dom',
            'acorn',
            'gulp-sourcemaps',
            'vinyl',
            'cosmiconfig',
            'jiti',
          ];

          return nodeModules.some(
            (pkg) => id === pkg || id.startsWith(`${pkg}/`) || id.includes(pkg)
          );
        },
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
          },
        },
      },
    },
  });
}
