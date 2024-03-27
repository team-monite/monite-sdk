import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';

import fs from 'fs';
import { RollupOptions } from 'rollup';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { swc } from 'rollup-plugin-swc3';

type Options = {
  url?: false | Parameters<typeof url>[0];
  svgr?: false | Parameters<typeof svgr>[0];
  postcss?: false | Parameters<typeof postcss>[0];
  swc?: Parameters<typeof swc>[0];
};

export const rollupConfig = (
  packageJson: { main?: string; module?: string; types: string },
  options?: Options
): RollupOptions[] => {
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
            } as const)
          : null,
        packageJson.module
          ? ({
              file: packageJson.module,
              format: 'esm',
              sourcemap: true,
            } as const)
          : null,
      ].filter((output): output is NonNullable<typeof output> =>
        Boolean(output)
      ),
      plugins: [
        json(),
        peerDepsExternal() as any,
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
              : { autoModules: true }
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
