import { rollupConfig } from '@team-monite/rollup-config';

import packageJson from './package.json' assert { type: 'json' };

export default rollupConfig({
  module: packageJson.exports['.'],
  types: packageJson.types,
});
