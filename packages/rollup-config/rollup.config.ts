import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import path from 'path';

import fs from 'fs';
import { RollupOptions } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import swc from '@rollup/plugin-swc';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import postcssImport from 'postcss-import';
import tailwindcss from '@tailwindcss/postcss';

type Options = {
  url?: false | Parameters<typeof url>[0];
  svgr?: false | Parameters<typeof svgr>[0];
  postcss?: false | Parameters<typeof postcss>[0];
  swc?: Parameters<typeof swc>[0];
  typescriptPaths?: Parameters<typeof typescriptPaths>[0];
  nodeResolve?: Parameters<typeof nodeResolve>[0];
};

export const rollupConfig = (
  packageJson: { main?: string; module?: string; types: string },
  options?: Options
): RollupOptions[] => {
  const configs: RollupOptions[] = [];

  if (packageJson.main) {
    configs.push({
      input: 'src/index.ts',
      external: (id) => {
        // LIst of external packages that should not be bundled
        const externalPackages = [
          '@tanstack/react-query',
          '@openapi-qraft/react',
          'd3-scale',
          'd3-shape',
          'canvas',
          'jsdom',
          'agent-base',
          'vinyl',
          'cosmiconfig'
        ];
        
        if (externalPackages.some(pkg => id.includes(pkg))) {
          return true;
        }
        
        if (/^(fs|path|os|crypto|util|events|stream|buffer|url|assert|child_process|cluster|dgram|dns|domain|http|https|net|punycode|querystring|readline|repl|string_decoder|sys|timers|tls|tty|vm|zlib|fs\/promises)$/.test(id)) {
          return true;
        }
        
        if (id.startsWith('node:')) {
          return true;
        }
        
        if (id.includes('.node')) {
          return true;
        }
        
        return false;
      },
      output: {
        file: packageJson.main,
        format: 'commonjs',
        sourcemap: true,
        sourcemapFile: packageJson.main + '.map',
        interop: 'compat',
        inlineDynamicImports: true,
      },
      plugins: [
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.ENABLE_SENTRY': JSON.stringify(process.env.ENABLE_SENTRY),
        }),
        json(),
        image(),
        options?.typescriptPaths && typescriptPaths(options.typescriptPaths),
        nodeResolve({
          browser: true,
          extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
          moduleDirectories: ['node_modules', 'src']
        }),
        peerDepsExternal() as any,
        postcss(
          typeof options?.postcss === 'object'
            ? options.postcss
            : {
                extensions: ['.css'],
                autoModules: true,
                extract: path.resolve('dist/cjs/index.css'),
                minimize: process.env.NODE_ENV === 'production',
                plugins: [
                  // Use postcss-import first for @import processing
                  postcssImport({
                    path: [path.resolve('src/core/theme'), path.resolve('src/styles')],
                  }),
                  tailwindcss({
                    optimize: process.env.NODE_ENV === 'production',
                  }),
                ],
              }
        ),
        commonjs(),
        typescriptPaths({
          preserveExtensions: true,
        }),
        swc(options?.swc),
        options?.svgr !== false &&
          svgr({
            include: '**/*.svg',
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          }),
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
      onwarn(warning, warn) {
        // Skip module level directives (like "use client")
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        
        if (warning.code === 'SOURCEMAP_ERROR' && warning.id?.includes('node_modules')) {
          const thirdPartyPackages = ['d3-scale', 'd3-shape', '@tanstack/react-query', '@openapi-qraft/react', 'recharts'];
          if (thirdPartyPackages.some(pkg => warning.id?.includes(pkg))) {
            return;
          }
        }
        
        if (warning.code === 'UNRESOLVED_IMPORT' && 'source' in warning && warning.source) {
          const externalPackages = ['d3-scale', 'd3-shape', '@tanstack/react-query', '@openapi-qraft/react'];
          if (externalPackages.some(pkg => (warning as any).source.includes(pkg))) {
            return;
          }
        }
        
        if (warning.code === 'EVAL' && warning.id?.includes('node_modules')) {
          return;
        }
        
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          const message = warning.message.toLowerCase();
          const [importer] = message.split(' -> ');
          
          if (importer && (
            importer.includes('node_modules') || 
            importer.includes('types.ts')
          )) {
            return;
          }
        }

        warn(warning);
      },
      watch: {
        chokidar: {
          usePolling: true,
        },
      },
    });
  }

  if (packageJson.module) {
    configs.push({
      input: 'src/index.ts',
      external: (id) => {
        // LIst of external packages that should not be bundled
        const externalPackages = [
          '@tanstack/react-query',
          '@openapi-qraft/react',
          'd3-scale',
          'd3-shape',
          'canvas',
          'jsdom',
          'agent-base',
          'vinyl',
          'cosmiconfig'
        ];
        
        if (externalPackages.some(pkg => id.includes(pkg))) {
          return true;
        }
        
        if (/^(fs|path|os|crypto|util|events|stream|buffer|url|assert|child_process|cluster|dgram|dns|domain|http|https|net|punycode|querystring|readline|repl|string_decoder|sys|timers|tls|tty|vm|zlib|fs\/promises)$/.test(id)) {
          return true;
        }
        
        if (id.startsWith('node:')) {
          return true;
        }
        
        if (id.includes('.node')) {
          return true;
        }
        
        return false;
      },
      output: {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
        sourcemapFile: packageJson.module + '.map',
        inlineDynamicImports: true,
      },
      plugins: [
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          'process.env.ENABLE_SENTRY': JSON.stringify(process.env.ENABLE_SENTRY),
        }),
        json(),
        image(),
        options?.typescriptPaths && typescriptPaths(options.typescriptPaths),
        nodeResolve({
          browser: true,
          extensions: ['.mjs', '.js', '.json', '.node', '.ts', '.tsx'],
          moduleDirectories: ['node_modules', 'src']
        }),
        peerDepsExternal() as any,
        postcss(
          typeof options?.postcss === 'object'
            ? options.postcss
            : {
                extensions: ['.css'],
                autoModules: true,
                extract: path.resolve('dist/esm/index.css'),
                minimize: process.env.NODE_ENV === 'production',
                plugins: [
                  // Use postcss-import first for @import processing
                  postcssImport({
                    path: [path.resolve('src/core/theme'), path.resolve('src/styles')],
                  }),
                  tailwindcss({
                    optimize: process.env.NODE_ENV === 'production',
                  }),
                ],
              }
        ),
        commonjs(),
        typescriptPaths({
          preserveExtensions: true,
        }),
        swc(options?.swc),
        options?.svgr !== false &&
          svgr({
            include: '**/*.svg',
            svgo: true,
            svgoConfig: {
              plugins: [
                {
                  name: 'preset-default',
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          }),
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
      onwarn(warning, warn) {
        // Skip module level directives (like "use client")
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        
        if (warning.code === 'SOURCEMAP_ERROR' && warning.id?.includes('node_modules')) {
          const thirdPartyPackages = ['d3-scale', 'd3-shape', '@tanstack/react-query', '@openapi-qraft/react', 'recharts'];
          if (thirdPartyPackages.some(pkg => warning.id?.includes(pkg))) {
            return;
          }
        }
        
        if (warning.code === 'UNRESOLVED_IMPORT' && 'source' in warning && warning.source) {
          const externalPackages = ['d3-scale', 'd3-shape', '@tanstack/react-query', '@openapi-qraft/react'];
          if (externalPackages.some(pkg => (warning as any).source.includes(pkg))) {
            return;
          }
        }
        
        if (warning.code === 'EVAL' && warning.id?.includes('node_modules')) {
          return;
        }
        
        if (warning.code === 'CIRCULAR_DEPENDENCY') {
          const message = warning.message.toLowerCase();
          const [importer] = message.split(' -> ');
          
          if (importer && (
            importer.includes('node_modules') || 
            importer.includes('types.ts')
          )) {
            return;
          }
        }

        warn(warning);
      },
      watch: {
        chokidar: {
          usePolling: true,
        },
      },
    });
  }

  return configs;
};

export const rollupConfigWithTypes = (
  packageJson: { main?: string; module?: string; types: string },
  options?: Options
): RollupOptions[] => {
  const configs = rollupConfig(packageJson, options);
  
  configs.push({
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
  });

  return configs;
};
