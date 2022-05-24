import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

const packageJson = require('../package.json');

async function getPlugins() {
  return [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    postcss({
      extract: 'monite.css',
      use: [
        'sass',
        [
          'less',
          {
            javascriptEnabled: true,
            modifyVars: {
              'ant-prefix': 'monite',
            },
          },
        ],
      ],
    }),
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
    },
    {
      input: 'dist/esm/types/index.d.ts',
      output: [{ file: 'dist/index.d.ts', format: 'esm' }],
      plugins: [dts()],

      external: [/\.css$/, /\.less$/, /\.scss$/],
    },
  ];

  return build;
};
