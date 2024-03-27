/** @type {import('eslint').Linter.Config} */
module.exports = {
  rules: {
    '@team-monite/mui-require-container-property': 'error',
  },
  overrides: [
    {
      files: ['*.stories.{ts,tsx,js}', 'src/mocks/**', '*.test.*', '*.spec.*'],
      rules: {
        '@team-monite/mui-require-container-property': 'off',
      },
    },
  ],
};
