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
          'monite-app': resolve(__dirname, 'src/monite-app.ts'),
          'monite-iframe-app': resolve(__dirname, 'src/monite-iframe-app.ts'),
          'monite-iframe-app-communicator': resolve(
            __dirname,
            'src/lib/MoniteIframeAppCommunicator.ts'
          ),
        },
        name: 'Monite Drop-in',
      },
    },
    resolve: { alias: { '@': resolve(__dirname, './src') } },
  });
}
