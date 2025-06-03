import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import htmlPlugin from 'vite-plugin-html-config';
// import { nodePolyfills } from 'vite-plugin-node-polyfills'; // REMOVED

import { version } from './package.json';

const htmlPluginOpt = {
  metas: [
    {
      name: 'version',
      content: version,
    },
  ],
};

export default async function viteConfig() {
  return defineConfig({
    plugins: [
      dts({
        outDir: 'build',
        entryRoot: 'src',
        // rollupTypes: true, // Consider if you want to bundle .d.ts files into a single file via Rollup
      }),
      react({
        jsxImportSource: '@emotion/react',
        plugins: [
          ['@lingui/swc-plugin', {}],
          ['@swc/plugin-emotion', {}],
        ],
      }),
      htmlPlugin(htmlPluginOpt),
      // nodePolyfills({
      //   protocolImports: true,
      //   globals: {
      //     Buffer: true,
      //     global: true,
      //     process: true,
      //   }
      // }), // REMOVED
    ],
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
    resolve: {
      alias: [
        {
          find: '@',
          replacement: resolve(__dirname, './src'),
        },
        // Ensure shared instances of React dependencies from monorepo root
        {
          find: /^react$/,
          replacement: resolve(__dirname, '../../node_modules/react'),
        },
        {
          find: /^react-dom$/,
          replacement: resolve(__dirname, '../../node_modules/react-dom'),
        },
        {
          find: '@emotion/react',
          replacement: resolve(__dirname, '../../node_modules/@emotion/react'),
        },
        {
          find: '@emotion/styled',
          replacement: resolve(__dirname, '../../node_modules/@emotion/styled'),
        },
        {
          find: /^vite$/,
          replacement: resolve(__dirname, '../../node_modules/vite'),
        },
        // Use regex-based aliasing to handle Node.js modules and their subpaths
        {
          find: /^fs(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^stream(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^util(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^path(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^os(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^tty(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: 'jsdom',
          replacement: resolve(__dirname, './src/empty.js'),
        },
      ],
    },
    define: {
      'process.env': {},
      'process.version': '""', // Corrected quotes
      'process.versions': { node: '""' }, // Corrected quotes, Mock process.versions.node
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
      'process.stdin': {
        fd: 0,
        isTTY: false,
      },
      global: 'window',
      // Make React globally available for bundled packages that expect it
      React: 'window.React',
    },
    build: {
      rollupOptions: {
        input: {
          ['index-html']: resolve(__dirname, 'index.html'),
          ['sdk-demo-app']: resolve(__dirname, 'src/sdk-demo-app.tsx'),
        },
        output: [
          {
            inlineDynamicImports: false,
            format: 'es',
            entryFileNames: (chunkInfo) => {
              if (chunkInfo.name === 'sdk-demo-app') {
                return `[name].js`;
              } else {
                return `[name].[hash].[format].js`;
              }
            },
          },
        ],
      },
    },
  });
}

