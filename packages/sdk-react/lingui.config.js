/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  compileNamespace: 'ts',
  sourceLocale: 'en',
  locales: ['en'],
  catalogs: [
    {
      path: 'src/core/i18n/locales/{locale}/messages',
      include: ['src'],
    },
  ],
  format: 'po',
};
