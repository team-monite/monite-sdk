import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
// import { visualizer } from 'rollup-plugin-visualizer';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss';
import pkg from '../package.json';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

const input = 'src/index.ts';

function getExternals() {
  return [];
}

async function getPlugins() {
  return [
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
        { find: 'react-dom', replacement: 'preact/compat' },
        { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
      ],
    }),
    resolve({ extensions }),
    commonjs(),
    replace({
      values: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      },
      preventAssignment: true,
    }),
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
    postcss({
      extract: 'monite.css',
    }),
    terser({
      output: {
        ecma: 2017,
        comments: false,
        // Turned on because emoji and regex is not minified properly using default
        // https://github.com/facebook/create-react-app/issues/2488
        ascii_only: true,
      },
    }),
    // visualizer({
    //   open: true,
    // }),
  ];
}

export default async () => {
  const plugins = await getPlugins();

  const build = [
    {
      input,
      external: getExternals(),
      plugins,
      output: [
        {
          dir: 'dist/es',
          format: 'es',
          chunkFileNames: '[name].js',
          sourcemap: false,
        },
      ],
    },
    {
      input,
      external: getExternals(),
      plugins: [...plugins],
      output: [
        {
          name: 'MoniteApp',
          file: pkg['umd:main'],
          format: 'umd',
          inlineDynamicImports: true,
          sourcemap: false,
        },
      ],
    },
  ];

  return build;
};
