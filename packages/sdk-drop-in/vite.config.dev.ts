import react from '@vitejs/plugin-react-swc';

import * as fs from 'node:fs';
import { basename, extname, resolve } from 'node:path';
import { defineConfig, PluginOption } from 'vite';

export default async function viteConfig() {
  const pages = await fs.promises.readdir(__dirname).then((files) => {
    return files
      .filter((file) => extname(file) === '.html')
      .map((file) => basename(file, '.html'));
  });

  return defineConfig({
    appType: 'mpa',
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
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
      React: 'React',
    },
    plugins: [
      multiPagesAppRewriteRootPlugin(pages),
      react({
        jsxImportSource: '@emotion/react',
        plugins: [['@swc/plugin-emotion', {}]],
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
        // Node.js module polyfills
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
          find: /^crypto(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^http(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^https(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^buffer(\/.*)?$/,
          replacement: resolve(__dirname, './src/empty.js'),
        },
        {
          find: /^canvas(\/.*)?$/,
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
  });
}

function multiPagesAppRewriteRootPlugin(pages: string[]): PluginOption {
  return {
    name: 'rewrite to multi-page app root',
    configureServer(serve) {
      serve.middlewares.use((req, _, next) => {
        const isStaticFile = /\w+\.\w+$/.test(req.url);
        const page =
          !isStaticFile &&
          pages.find(
            (page) => req.url.startsWith(`/${page}/`) && !/\.\w+$/.test(req.url)
          );
        if (page) {
          req.url = `/${page}.html`;
        }
        next();
      });
    },
  };
}
