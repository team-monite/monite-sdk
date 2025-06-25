import { rollupConfigWithTypes } from '@team-monite/rollup-config';

import packageJson from '../package.json' with { type: 'json' };

export default rollupConfigWithTypes(packageJson);
