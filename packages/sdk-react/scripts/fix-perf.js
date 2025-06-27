/* eslint-env node */
/**
 * Fixes the global performance object by replacing it with Node's performance implementation.
 * This is necessary because some environments might have a broken or missing performance API.
 * @returns {boolean} Whether the fix was successful
 */
const { performance } = require('node:perf_hooks');

function fixPerformance() {
  delete global.performance;
  global.performance = performance;

  if (require.cache) {
    // Use a minimal module object for cache entries
    const Module = require('module');
    const perfModule = Object.assign(Object.create(Module.Module ? Module.Module.prototype : Module.prototype), {
      id: require.resolve('node:perf_hooks'),
      filename: require.resolve('node:perf_hooks'),
      loaded: true,
      exports: { performance },
    });
    require.cache[require.resolve('node:perf_hooks')] = perfModule;

    try {
      const barePerfHooksPath = require.resolve('perf_hooks');
      if (barePerfHooksPath !== require.resolve('node:perf_hooks')) {
        const barePerfModule = Object.assign(Object.create(Module.Module ? Module.Module.prototype : Module.prototype), {
          id: barePerfHooksPath,
          filename: barePerfHooksPath,
          loaded: true,
          exports: { performance },
        });
        require.cache[barePerfHooksPath] = barePerfModule;
      }
    } catch {
      // If 'perf_hooks' doesn't resolve, that's fine - we can ignore it
    }
  }

  if (typeof global.performance?.now !== 'function') {
    // eslint-disable-next-line no-console
    console.error('[fix-perf] Failed to fix performance API');
    return false;
  }

  return true;
}

// Optionally run immediately if used as a script
if (require.main === module) {
  fixPerformance();
}

module.exports = { fixPerformance };
