import { rollupConfig } from '@team-monite/rollup-config';

import packageJson from '../package.json' assert { type: 'json' };

// eslint-disable-next-line import/no-default-export
export default rollupConfig(packageJson);
