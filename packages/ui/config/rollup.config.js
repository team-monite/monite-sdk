import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import svgr from '@svgr/rollup';
import url from '@rollup/plugin-url';
import alias from '@rollup/plugin-alias';

const packageJson = require('../package.json');
const watchConfig = {
  chokidar: {
    usePolling: true,
    useFsEvents: false,
    interval: 500,
  },
  exclude: 'node_modules/**',
};

async function getPlugins() {
  return [
    url(),
    svgr({ exportType: 'named', icon: true }),
    peerDepsExternal(),
    resolve({ browser: true, extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss({}),
    // terser(),
    // visualizer({
    //   open: true,
    // }),
  ];
}

export default async () => {
  const plugins = await getPlugins();

  const build = [
    {
      input: 'src/index.ts',
      output: [
        {
          file: packageJson.main,
          format: 'cjs',
          sourcemap: true,
        },
        {
          file: packageJson.module,
          format: 'esm',
          sourcemap: true,
        },
      ],
      plugins,
      watch: watchConfig,
    },
    {
      input: 'dist/esm/types/index.d.ts',
      output: [{ file: 'dist/index.d.ts', format: 'esm' }],
      plugins: [
        alias({
          entries: [
            {
              find: /.*\.svg$/,
              replacement: 'src/types/icon.d.ts',
            },
          ],
        }),
        dts(),
      ],

      external: [/\.css$/, /\.less$/, /\.scss$/],
      watch: watchConfig,
    },
  ];

  return build;
};
