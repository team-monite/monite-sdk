import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import tailwindcss from '@tailwindcss/postcss';

import fs from 'fs';
import { RollupOptions } from 'rollup';
import { dts } from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import postcssImport from 'postcss-import';
import swc from '@rollup/plugin-swc';
import { typescriptPaths } from 'rollup-plugin-typescript-paths';
import { Plugin } from 'rollup';

const suppressSourcemapErrors = (): Plugin => {
  let originalError: typeof console.error;
  let originalWarn: typeof console.warn;
  let originalLog: typeof console.log;
  
  return {
    name: 'suppress-sourcemap-errors',
    buildStart() {
      originalError = console.error;
      originalWarn = console.warn;
      originalLog = console.log;
      
      console.error = (...args) => {
        const message = args.join(' ').toLowerCase();
        if (message.includes('error when using sourcemap') || 
            message.includes("can't resolve original location") ||
            message.includes('could not resolve import') ||
            message.includes('use of eval') ||
            message.includes('d3-scale') ||
            message.includes('d3-shape') ||
            message.includes('@tanstack/react-query') ||
            message.includes('@openapi-qraft/react') ||
            message.includes('sourcemap error') ||
            message.includes('sourcemap warning')) {
          return;
        }
        originalError.apply(console, args);
      };
      
      console.warn = (...args) => {
        const message = args.join(' ').toLowerCase();
        if (message.includes('sourcemap') || 
            message.includes('d3-') ||
            message.includes('eval') ||
            message.includes('react-query')) {
          return;
        }
        originalWarn.apply(console, args);
      };
    },
    buildEnd() {
      if (originalError) console.error = originalError;
      if (originalWarn) console.warn = originalWarn;
      if (originalLog) console.log = originalLog;
    }
  };
};

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
        if (id.includes('@tanstack/react-query') || 
            id.includes('@openapi-qraft/react') ||
            id.includes('d3-scale') || 
            id.includes('d3-shape')) {
          return true;
        }
        if (id.includes('canvas') || id.includes('jsdom') || id.includes('.node') || id.includes('agent-base') || id.includes('vinyl') || id.includes('cosmiconfig')) {
          return true;
        }
        if (/^(fs|path|os|crypto|util|events|stream|buffer|url|assert|child_process|cluster|dgram|dns|domain|http|https|net|punycode|querystring|readline|repl|string_decoder|sys|timers|tls|tty|vm|zlib|fs\/promises)$/.test(id)) {
          return true;
        }
        if (id.startsWith('node:')) {
          return true;
        }
        return false;
      },
      output: {
        file: packageJson.main,
        format: 'commonjs',
        sourcemap: false,
        interop: 'compat',
        inlineDynamicImports: true,
      },
      plugins: [
        suppressSourcemapErrors(),
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
                extract: true,
                minimize: process.env.NODE_ENV === 'production',
                plugins: [
                  postcssImport(),
                  tailwindcss(),
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
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
       
        if (warning.code === 'SOURCEMAP_ERROR') return;
        
        if (warning.message && warning.message.includes('Error when using sourcemap')) return;
        if (warning.message && warning.message.includes("Can't resolve original location")) return;
        
        if (warning.code === 'UNRESOLVED_IMPORT' && 'source' in warning && warning.source) {
          const externalPackages = ['d3-scale', 'd3-shape', '@tanstack/react-query', '@openapi-qraft/react'];
          if (externalPackages.some(pkg => (warning as any).source.includes(pkg))) {
            return;
          }
        }
        
        if (warning.code === 'EVAL' && warning.id?.includes('node_modules')) {
          return;
        }
        
        if (warning.message && (warning.message.includes('d3-scale') || warning.message.includes('d3-shape'))) {
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
        if (id.includes('@tanstack/react-query') || 
            id.includes('@openapi-qraft/react') ||
            id.includes('d3-scale') || 
            id.includes('d3-shape')) {
          return true;
        }
        if (id.includes('canvas') || id.includes('jsdom') || id.includes('.node') || id.includes('agent-base') || id.includes('vinyl') || id.includes('cosmiconfig')) {
          return true;
        }
        if (/^(fs|path|os|crypto|util|events|stream|buffer|url|assert|child_process|cluster|dgram|dns|domain|http|https|net|punycode|querystring|readline|repl|string_decoder|sys|timers|tls|tty|vm|zlib|fs\/promises)$/.test(id)) {
          return true;
        }

        if (id.startsWith('node:')) {
          return true;
        }
        return false;
      },
      output: {
        file: packageJson.module,
        format: 'esm',
        sourcemap: false,
        inlineDynamicImports: true,
      },
      plugins: [
        suppressSourcemapErrors(),
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
                extract: true,
                minimize: process.env.NODE_ENV === 'production',
                plugins: [
                  postcssImport(),
                  tailwindcss(),
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
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return;
        
        if (warning.code === 'SOURCEMAP_ERROR') return;
        
        if (warning.message && warning.message.includes('Error when using sourcemap')) return;
        if (warning.message && warning.message.includes("Can't resolve original location")) return;
        
        if (warning.code === 'UNRESOLVED_IMPORT' && 'source' in warning && warning.source) {
          const externalPackages = ['d3-scale', 'd3-shape', '@tanstack/react-query', '@openapi-qraft/react'];
          if (externalPackages.some(pkg => (warning as any).source.includes(pkg))) {
            return;
          }
        }
        
        if (warning.code === 'EVAL' && warning.id?.includes('node_modules')) {
          return;
        }
        
        if (warning.message && (warning.message.includes('d3-scale') || warning.message.includes('d3-shape'))) {
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
