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

export default defineConfig({
  plugins: [
    dts({
      outDir: 'build',
      entryRoot: 'src',
    }),
    react({
      jsxImportSource: '@emotion/react',
      plugins: [['@lingui/swc-plugin', {}]],
    }),
    htmlPlugin(htmlPluginOpt),
  ],
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      'react',
      'react-dom',
    ],
    exclude: [
      '@monite/sdk-react',
      '@lingui/macro',
      'acorn',
      'gulp-sourcemaps',
      'jiti',
      'cosmiconfig',
      'vinyl',
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
    ],
  },
  define: {
    global: 'globalThis',
  },
  server: {
    fs: {
      allow: ['../..'],
    },
  },
  build: {
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
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
          'electron',
          'child_process',
          'worker_threads',
          'cluster',
          'dns',
        ];

        const problematicPackages = [
          'acorn',
          'gulp-sourcemaps',
          'cosmiconfig',
          'jiti',
          'vinyl',
        ];

        const isExternal = external.some(
          (pkg) => id === pkg || id.startsWith(`${pkg}/`)
        );

        const isProblematicPackage = problematicPackages.some(
          (pkg) =>
            id === pkg ||
            id.startsWith(`${pkg}/`) ||
            id.includes(`node_modules/${pkg}`)
        );

        return isExternal || isProblematicPackage;
      },
    },
  },
});
