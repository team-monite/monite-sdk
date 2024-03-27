/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['eslint-plugin-lingui'],
  rules: {
    'lingui/no-unlocalized-strings': [
      'warn',
      {
        ignore: ['Mui'],
        ignoreFunction: [
          'Error',
          'console.log',
          'console.error',
          'console.debug',
          'createElement',
          'defineMessage',
        ],
        ignoreAttribute: [
          'classes',
          'sx',
          'slotProps',
          'style',
          'toastOptions',
          'data-testid',
          'rel',
        ],
        ignoreProperty: ['style', 'fontFamily', 'padding', 'margin'],
      },
    ],
    'lingui/t-call-in-function': 'warn',
    'lingui/no-single-variables-to-translate': 'warn',
    'lingui/no-expression-in-message': 'warn',
    'lingui/no-single-tag-to-translate': 'warn',
    'lingui/no-trans-inside-trans': 'warn',
    'lingui/text-restrictions': 'off',
    '@team-monite/lingui-require-argument-for-t-function': 'warn',
  },
  overrides: [
    {
      files: ['*.stories.{ts,tsx,js}', 'src/mocks/**', '*.test.*', '*.spec.*'],
      rules: {
        '@team-monite/lingui-require-argument-for-t-function': 'off',
        'lingui/no-unlocalized-strings': 'off',
      },
    },
  ],
};
