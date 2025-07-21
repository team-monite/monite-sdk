import packageJson from '../package.json' with { type: 'json' };

import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/postcss';

import fs from 'fs';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';

const rollupConfig = (packageJson, options) => {
  return [
    {
      input: 'src/index.ts',
      output: [
        packageJson.main
          ? ({
              file: packageJson.main,
              format: 'commonjs',
              sourcemap: true,
              interop: 'compat',
            })
          : null,
        packageJson.module
          ? ({
              file: packageJson.module,
              format: 'esm',
              sourcemap: true,
            })
          : null,
      ].filter((output) => Boolean(output)),
      plugins: [
        json(),
        image(),
        peerDepsExternal(),
        commonjs(),
        swc(options?.swc ? options.swc : { swcrc: true, sourceMaps: true }),
        options?.svgr !== false &&
          svgr(
            typeof options?.svgr === 'object'
              ? options.svgr
              : { babel: false, svgo: false }
          ),
        options?.postcss !== false &&
          postcss(
            typeof options?.postcss === 'object'
              ? options.postcss
              : {
                  autoModules: true,
                  plugins: [
                    tailwindcss({
                      optimize: process.env.NODE_ENV === 'production',
                    }),
                  ],
                }
          ),
        options?.url !== false &&
          url(
            typeof options?.url === 'object'
              ? options.url
              : {
                  include: ['**/*.woff', '**/*.woff2'],
                  limit: Infinity,
                }
          ),
      ],
      watch: {
        chokidar: {
          usePolling: true,
          useFsEvents: false,
          interval: 500,
        },
        exclude: 'node_modules/**',
      },
    },
    {
      input: 'src/index.ts',
      output: [{ file: packageJson.types, format: 'esm' }],
      plugins: [
        dts({
          tsconfig: fs.existsSync('tsconfig.build.json')
            ? 'tsconfig.build.json'
            : 'tsconfig.json',
          compilerOptions: {
            noEmitOnError: false,
          },
        }),
      ],
      external: [/\.css$/, /\.less$/, /\.scss$/],
      watch: {
        chokidar: {
          usePolling: true,
          useFsEvents: true,
          interval: 500,
        },
        include: 'src/**/*.{ts,tsx,js,jsx,cjs,mjs,json,css,less,scss}',
        exclude: 'node_modules/**',
      },
    },
  ];
};

export default rollupConfig({
  main: packageJson.main,
  module: packageJson.module,
  types: packageJson.types,
});