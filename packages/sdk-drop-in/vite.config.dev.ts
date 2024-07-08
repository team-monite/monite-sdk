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
    plugins: [
      multiPagesAppRewriteRootPlugin(pages),
      react({
        jsxImportSource: '@emotion/react',
        plugins: [['@swc/plugin-emotion', {}]],
      }),
    ],
    resolve: { alias: { '@': resolve(__dirname, './src') } },
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
