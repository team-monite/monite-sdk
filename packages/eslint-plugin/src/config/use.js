/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['@team-monite'],
  rules: {
    '@team-monite/use-boolean-for-enabled': 'error',
  },
  overrides: [
    {
      files: ['*.stories.{ts,tsx,js}', 'src/mocks/**', '*.test.*', '*.spec.*'],
      rules: {
        '@team-monite/use-boolean-for-enabled': 'off',
      },
    },
  ],
};
