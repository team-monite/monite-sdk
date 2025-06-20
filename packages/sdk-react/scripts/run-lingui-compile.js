/* eslint-disable */
/* eslint-env node */
'use strict';

const { spawnSync } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

// Path to our preload script that fixes global.performance
const fixPerfScriptPath = path.resolve(__dirname, 'fix-perf.js');

// Resolve the actual JavaScript file for the Lingui CLI
let linguiCliJsPath;
try {
  // Construct the path to the Lingui CLI script directly
  // Assumes @lingui/cli is installed in the monorepo root's node_modules
  linguiCliJsPath = path.resolve(
    __dirname,
    '../../../node_modules/@lingui/cli/dist/lingui.js'
  );

  // Verify the path exists
  if (!fs.existsSync(linguiCliJsPath)) {
    throw new Error(`Lingui CLI script not found at: ${linguiCliJsPath}`);
  }
  console.log(
    `[run-lingui-compile.js] Using Lingui CLI JS path: ${linguiCliJsPath}`
  );
} catch (e) {
  console.error(
    '[run-lingui-compile.js] CRITICAL: Could not find @lingui/cli/dist/lingui.js. Is @lingui/cli installed correctly in the monorepo root?'
  );
  console.error('[run-lingui-compile.js] Error details:', e);
  process.exit(1);
}

// Directory where lingui commands should execute (packages/sdk-react)
const packageDir = path.resolve(__dirname, '..');

console.log(
  `[run-lingui-compile.js] Running Lingui compile via: node --require=${fixPerfScriptPath} ${linguiCliJsPath} compile`
);
console.log(`[run-lingui-compile.js] Working directory: ${packageDir}`);

const result = spawnSync(
  process.execPath, // This is the path to the current 'node' executable
  [
    `--require=${fixPerfScriptPath}`, // Preload our performance fix script
    linguiCliJsPath, // The actual Lingui CLI JavaScript file
    'compile', // The command for Lingui CLI
    // Add any other default Lingui CLI arguments here if needed, e.g., '--verbose'
  ],
  {
    cwd: packageDir, // Run in the context of packages/sdk-react
    stdio: 'inherit', // Show output/errors directly
    shell: false, // Important: execute node directly, don't go through another shell
    env: { ...process.env }, // Inherit current environment
  }
);

if (result.error) {
  console.error(
    `[run-lingui-compile.js] Failed to start Lingui process:`,
    result.error
  );
  process.exit(1);
}

if (result.status !== 0) {
  console.error(
    `[run-lingui-compile.js] Lingui process exited with status ${result.status}`
  );
}

process.exit(result.status === null ? 1 : result.status);
