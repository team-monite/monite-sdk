/**
 * By default, set to true for performance
 *
 * But `ts-jest` works better for debugging,
 *  so you can switch the flag to `false` if
 *  you need to debug the test cases
 *
 * `@swc` is a new compiler, which is much faster than `ts-jest`
 * It works approximately 60% faster than `ts-jest`
 */
const useSwcConfig = true;

const config = useSwcConfig
  ? {
      '^.+\\.(t|j)s$': [
        '@swc/jest',
        {
          sourceMaps: 'inline', // set `inline` for development purpose

          jsc: {
            parser: {
              syntax: 'typescript',
              tsx: false,
            },
          },
        },
      ],
    }
  : {
      '^.+\\.(t|j)s$': ['ts-jest'],
    };

module.exports = {
  testEnvironment: 'jsdom',
  /**
   * We have to specify this option based on MSW's documentation
   *
   * @see {@link https://mswjs.io/docs/migrations/1.x-to-2.x#cannot-find-module-mswnode-jsdom}
   */
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  extensionsToTreatAsEsm: ['.ts'],
  automock: false,
  resetMocks: false,
  setupFilesAfterEnv: ['./setup-tests.cjs', './setupJest.ts'],
  transform: config,
};
