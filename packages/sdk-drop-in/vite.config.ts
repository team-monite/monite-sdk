import react from '@vitejs/plugin-react-swc';

import { resolve } from 'node:path';
import { defineConfig, ConfigEnv } from 'vite';

export default async function viteConfig({ mode }: ConfigEnv) {
  return defineConfig({
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    plugins: [
      react({
        jsxImportSource: '@emotion/react',
        plugins: [['@swc/plugin-emotion', {}]],
      }),
    ],
    build: {
      sourcemap: true,
      lib: {
        entry: {
          'monite-app': resolve(__dirname, 'src/index.ts'),
          'monite-iframe-app-message-channel': resolve(
            __dirname,
            'src/lib/IframeClassManager.ts'
          ),
        },
        name: 'Monite Drop-in',
      },
    },
    resolve: { alias: { '@': resolve(__dirname, './src') } },
  });
}
