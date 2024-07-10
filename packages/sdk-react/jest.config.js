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
      '^.+\\.(t|j)sx?$': [
        '@swc/jest',
        {
          // sourceMaps: 'inline', // set `inline` for development purpose

          jsc: {
            transform: {
              react: {
                runtime: 'automatic',
              },
            },
            parser: {
              syntax: 'typescript',
              tsx: true,
            },
          },
        },
      ],
    }
  : {
      '^.+\\.(t|j)sx?$': ['ts-jest'],
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
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/components/payment/**/*.{js,jsx,ts,tsx}',
    '!src/core/i18n/**/*.{js,jsx,ts,tsx}',
    '!src/mocks/**/*.{js,jsx,ts,tsx}',
    '!src/utils/**/*.{js,jsx,ts,tsx}',
    '!src/api/services/**/*.{ts}',
    '!src/api/api-version.ts',
    '!src/api/create-api-client.ts',
    '!src/api/index.ts',
    '!src/api/schema.ts',
    '!<rootDir>/node_modules/',
  ],
  coverageThreshold: {
    global: {
      branches: 35,
      functions: 36,
      lines: 60,
      statements: 58,
    },
    './src/components/tags': {
      branches: 80,
      functions: 78,
      lines: 91,
      statements: 90,
    },
    './src/components/counterparts': {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80,
    },
    './src/components/payables': {
      branches: 15,
      functions: 25,
      lines: 55,
      statements: 55,
    },
    './src/components/products': {
      branches: 81,
      functions: 85,
      lines: 96,
      statements: 96,
    },
    './src/components/receivables': {
      branches: 35,
      functions: 25,
      lines: 60,
      statements: 55,
    },
  },
  setupFilesAfterEnv: ['./setup-tests.cjs', './src/setupTests.tsx'],
  transform: config,
};
