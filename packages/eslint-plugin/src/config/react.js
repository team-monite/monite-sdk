/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    'plugin:@team-monite/vanilla',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  plugins: ['react-refresh'],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    'no-restricted-imports': [
      'error',
      {
        'paths': [
          {
            'name': 'react',
            'importNames': ['default'],
          }
        ]
      }
    ],
  },
  overrides: [
    {
      files: ['*.stories.{ts,tsx}'],
      rules: {
        'import/no-default-export': 'off',
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
  ],
};
