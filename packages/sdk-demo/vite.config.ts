import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import htmlPlugin from 'vite-plugin-html-config';

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
      }),
      react({
        jsxImportSource: '@emotion/react',
      }),
      htmlPlugin(htmlPluginOpt)
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
        {
          find: /^fs(\/.*)?$/,
          replacement: resolve(__dirname, '../../src/polyfills/fs.js'),
        },
        {
          find: /^stream(\/.*)?$/,
          replacement: resolve(__dirname, '../../src/polyfills/stream.js'),
        },
        {
          find: /^util(\/.*)?$/,
          replacement: resolve(__dirname, '../../src/polyfills/util.js'),
        },
        {
          find: /^path(\/.*)?$/,
          replacement: resolve(__dirname, '../../src/polyfills/path.js'),
        },
        {
          find: /^os(\/.*)?$/,
          replacement: resolve(__dirname, '../../src/polyfills/os.js'),
        },
        {
          find: /^tty(\/.*)?$/,
          replacement: resolve(__dirname, '../../src/polyfills/empty.js'),
        },
        {
          find: 'jsdom',
          replacement: resolve(__dirname, '../../src/polyfills/empty.js'),
        },
      ],
    },
    define: {
      'process.env': {},
      'process.version': '""',
      'process.versions': { node: '""' },
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
        external: (id) => {
          const external = [
            'acorn',
            'gulp-sourcemaps',
            'vinyl',
            'cosmiconfig'
          ];

          return external.some(pkg => id.includes(pkg));
        },
      },
    },
  });
}

