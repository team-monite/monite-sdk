import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import url from 'rollup-plugin-url';
// import { visualizer } from 'rollup-plugin-visualizer';
// import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

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
    peerDepsExternal(),
    resolve({ browser: true, extensions: ['.js', '.jsx', '.ts', '.tsx'] }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss({ autoModules: true }),
    url({
      include: ['**/*.woff', '**/*.woff2'],
      limit: Infinity,
    }),
    // terser(),
    // visualizer({
    //   open: true,
    // }),
  ];
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async () => {
  const plugins = await getPlugins();

  return [
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
      plugins: [dts()],

      external: [/\.css$/, /\.less$/, /\.scss$/],
      watch: watchConfig,
    },
  ];
};
