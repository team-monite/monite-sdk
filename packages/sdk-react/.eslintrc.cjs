const path = require('path');

module.exports = {
  extends: [
    'plugin:@team-monite/eslint-plugin/react',
    'plugin:@team-monite/eslint-plugin/lingui',
    'plugin:@team-monite/eslint-plugin/mui',
  ],
  plugins: ['@team-monite/eslint-plugin'],
  ignorePatterns: [
    'src/core/i18n/locales/*/messages.ts',
    'src/core/i18n/locales/*/messages.d.ts',
    '*Fixture.ts',
    'src/api/services/**/*',
    'src/api/api-version.ts',
    'src/api/create-api-client.ts',
    'src/api/index.ts',
    'src/api/schema.ts',
  ],
  rules: {
    'import/no-unresolved': 'error',
    '@team-monite/mui-require-container-property': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@tanstack/react-query',
            // eslint-disable-next-line lingui/no-unlocalized-strings
            importNames: ['useQueryClient', 'QueryClientProvider'],
          },
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [
          'packages/sdk-react/tsconfig.json',
          'tsconfig.json'
        ],
      },
    },
  },
  overrides: [
    {
      files: [
        'src/api/**/*.{ts,tsx}', // Covers API related files
        'src/config/**/*.{ts,tsx}',
        'src/core/constants/**/*.{ts,tsx}',
        'src/core/data/**/*.{ts,tsx}',
        'src/core/hooks/**/*.{ts,tsx}', // Generalized from useFileInput.tsx
        'src/core/queries/**/*.{ts,tsx}', // Generalized from usePermissions.ts
        'src/core/utils/**/*.{ts,tsx}',
        'src/core/validation/**/*.{ts,tsx}',
        'src/lib/**/*.{ts,tsx}', // For other library-like code
        'src/stories/**/*.{ts,tsx}', // For Storybook files
        'src/ui/**/*.{ts,tsx}', // Added for general UI components like CountryFlag
        'src/types/**/*.ts', // For global/shared type definitions
        // Component-specific technical files
        'src/components/**/const*.{ts,tsx}',
        'src/components/**/helpers.{ts,tsx}',
        'src/components/**/utils.{ts,tsx}',
        'src/components/**/hooks/**/*.{ts,tsx}',
        'src/components/**/data.{ts,tsx}',
        'src/components/**/types.{ts,tsx}',
        'src/components/**/context/**/*.{ts,tsx}',
        'src/components/**/transformers/**/*.{ts,tsx}',
      ],
      rules: {
        'lingui/no-unlocalized-strings': 'off',
        '@team-monite/lingui-require-argument-for-t-function': 'off',
        'lingui/t-call-in-function': 'off',
        'lingui/no-single-variables-to-translate': 'off',
        'lingui/no-expression-in-message': 'off',
        'lingui/no-single-tag-to-translate': 'off',
        'lingui/no-trans-inside-trans': 'off',
        'lingui/text-restrictions': 'off', // Also disable text-restrictions if it causes issues here
      },
    },
    {
      files: [
        '**/*.test.{ts,tsx,js,jsx}',
        '**/*.spec.{ts,tsx,js,jsx}',
        '**/*.stories.{ts,tsx,js,jsx}',
        '**/mocks/**/*',
        '**/*Fixture.{ts,tsx,js,jsx}',
        '**/*Fixtures.{ts,tsx,js,jsx}',
        '**/*fixture.{ts,tsx,js,jsx}',
        '**/*fixtures.{ts,tsx,js,jsx}',
        '**/*Handlers.{ts,tsx,js,jsx}',
        '**/*handlers.{ts,tsx,js,jsx}',
        'src/utils/test-utils.test.tsx',
        // Configuration and development files
        'vitest.config.ts',
        'vitest.config.mts',
        'vitest.setup.ts',
        'vite.config.ts',
        'config/rollup.config.mjs',
        // Test utility and helper files
        'src/components/counterparts/CounterpartDetails/CounterpartTestHelpers.ts',
        'src/utils/form/FillForm.executor.ts',
        'src/utils/test-utils.tsx',
        'src/components/onboarding/onboardingTestUtils.ts',
      ],
      rules: {
        'lingui/no-unlocalized-strings': 'off',
        'lingui/t-call-in-function': 'off',
        'lingui/no-single-variables-to-translate': 'off',
        'lingui/no-expression-in-message': 'off',
        'lingui/no-single-tag-to-translate': 'off',
        'lingui/no-trans-inside-trans': 'off',
        'lingui/text-restrictions': 'off',
        '@team-monite/lingui-require-argument-for-t-function': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { 
            devDependencies: true,
            peerDependencies: true,
            packageDir: [__dirname, path.join(__dirname, '../..')]
          },
        ],
      },
    },
    {
      files: ['*'],
      rules: {
        'import/no-duplicates': 'off',

        'no-prototype-builtins': 'off',

        'prefer-const': 'warn',

        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              '{}': false,
            },
          },
        ],
      },
    },
    // Icon components - use generic patterns
    {
      files: [
        '**/icons/**/*.{ts,tsx}',
        '**/*Icon.{ts,tsx}',
        '**/*icon.{ts,tsx}',
      ],
      rules: {
        'lingui/no-unlocalized-strings': 'off',
      },
    },
    {
      files: ['src/mocks/entityUsers/entityUserByIdFixture.ts'],
      rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: ['src/components/onboarding/hooks/useOnboardingValidation.ts'],
      rules: {
        'import/named': 'off',
      },
    },
    {
      files: ['src/components/payables/PayablesTable/PayablesTable.test.tsx'],
      rules: {
        'no-empty': 'off',
      },
    },
    {
      files: ['vitest.config.mts'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
    {
      files: ['.eslintrc.cjs', '.eslintrc.js'],
      parserOptions: {
        project: null,
      },
    },
  ],
};
