import packageJson from '../package.json' with { type: 'json' };
import { rollupConfig } from '@team-monite/rollup-config';

export default rollupConfig(packageJson);
