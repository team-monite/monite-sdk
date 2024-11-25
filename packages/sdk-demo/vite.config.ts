import react from '@vitejs/plugin-react-swc';

import { resolve } from 'path';
import { defineConfig } from 'vite';
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
      react({
        jsxImportSource: '@emotion/react',
        plugins: [
          ['@lingui/swc-plugin', {}],
          ['@swc/plugin-emotion', {}],
        ],
      }),
      htmlPlugin(htmlPluginOpt),
    ],
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
    resolve: { alias: { '@': resolve(__dirname, './src') } },
  });
}
