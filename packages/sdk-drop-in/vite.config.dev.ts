import react from '@vitejs/plugin-react-swc';

import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default async function viteConfig() {
  return defineConfig({
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        plugins: [['@swc/plugin-emotion', {}]],
      }),
    ],
    resolve: { alias: { '@': resolve(__dirname, './src') } },
  });
}
