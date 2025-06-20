import { rollupConfig } from '@team-monite/rollup-config';

import packageJson from '../package.json' with { type: 'json' };

export default rollupConfig(packageJson);
