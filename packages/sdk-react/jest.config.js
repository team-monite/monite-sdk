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
      branches: 85,
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
      functions: 93,
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
