/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['eslint-plugin-lingui'],
  rules: {
    'lingui/no-unlocalized-strings': [
      'warn',
      {
        ignore: ['Mui', 'Monite'],
        ignoreFunction: [
          'Error',
          'console.log',
          'console.error',
          'console.debug',
          'createElement',
          'defineMessage',
          'styled',
        ],
        ignoreAttribute: [
          'classes',
          'sx',
          'slotProps',
          'style',
          'toastOptions',
          'data-testid',
          'rel',
          'accept'
        ],
        ignoreProperty: [
          'style',
          'fontFamily',
          'padding',
          'paddingRight',
          'paddingLeft',
          'paddingTop',
          'paddingBottom',
          'margin',
          'marginRight',
          'marginLeft',
          'marginTop',
          'marginBottom',
          'border',
          'borderRight',
          'borderLeft',
          'borderTop',
          'borderBottom',
        ],
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
