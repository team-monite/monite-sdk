import { rollupConfigWithTypes as createRollupConfig } from '@team-monite/rollup-config';

import packageJson from '../package.json' with { type: 'json' };

const sdkReactSwcOptions = {
  exclude: ['**/*.css'],
  jsc: {
    experimental: {
      plugins: [
        ['@lingui/swc-plugin', {}],
        ['@swc/plugin-emotion', {}],
      ],
    },
    transform: {
      react: {
        runtime: 'automatic',
      },
    },
  },
};

// eslint-disable-next-line import/no-default-export
export default createRollupConfig(packageJson, {
  swc: sdkReactSwcOptions,
});
