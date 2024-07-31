/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/recommended',
  ],
  plugins: ['import', 'testing-library', '@team-monite', 'unused-imports'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-default-export': 'error',
    'import/no-extraneous-dependencies': ['error', { devDependencies: false }],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      files: ['*.test.{ts,tsx,js,jsx,mjs,cjs}'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
  ],
  settings: {
    'import/resolver': {
      typescript: {}, // this will set the default path for tsconfig.json to ./tsconfig.json
    },
  },
};
