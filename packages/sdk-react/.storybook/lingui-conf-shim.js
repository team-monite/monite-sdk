console.log('[lingui-conf-shim] Initializing custom shim for @lingui/conf');

/**
 * This is a mocked version of getConfig from @lingui/conf.
 * It attempts to return a minimal configuration object that might
 * satisfy the Lingui macro's runtime needs without actually loading
 * any configuration files or using cosmiconfig.
 */
export function getConfig(options) {
  console.warn('[lingui-conf-shim] getConfig() called. Options:', options, 'Returning minimal default config.');
  // This structure is a guess. It might need adjustment based on
  // what the Lingui macro runtime actually tries to access from the config.
  return {
    locales: ['en', 'default'], // Common practice to have 'default' or sourceLocale
    sourceLocale: 'en',
    catalogs: [{ path: 'locales/{locale}/messages', include: ['src/'] }],
    format: 'po',
    compileNamespace: 'es', // Or 'ts', 'cjs', etc. - affects generated catalog structure if used
    fallbackLocales: {},
    runtimeConfigModule: {
      i18n: ['@lingui/core', 'i18n'],
      Trans: ['@lingui/react', 'Trans'],
    },
    // Add other fields if errors indicate they are missing from the config object
  };
}

/**
 * Mocks cosmiconfigSync itself, as it's called by the original @lingui/conf.
 * If @lingui/conf is shimmed, its internal calls to cosmiconfigSync
 * will hit this mocked version.
 */
export function cosmiconfigSync(moduleName, options) {
  console.warn(`[lingui-conf-shim] cosmiconfigSync('${moduleName}') called. Returning dummy loader.`);
  return {
    load: (path) => {
      console.warn(`[lingui-conf-shim] cosmiconfigSync.load('${path}') called. Returning null.`);
      return null;
    },
    search: (searchFrom) => {
      console.warn(`[lingui-conf-shim] cosmiconfigSync.search('${searchFrom}') called. Returning null.`);
      return null;
    },
    clearLoadCache: () => {},
    clearSearchCache: () => {},
    clearCaches: () => {},
  };
}

// If @lingui/conf exports other things that are needed by the macro runtime,
// they might need to be added here. For now, focusing on getConfig and the
// problematic cosmiconfigSync.

// Default export (if @lingui/conf has one and it's used)
// export default { getConfig, cosmiconfigSync }; // Or whatever structure is appropriate

console.log('[lingui-conf-shim] Custom shim for @lingui/conf fully defined.'); 