/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  compileNamespace: 'ts',
  sourceLocale: 'en',
  locales: ['en'],
  catalogs: [
    {
      path: 'src/locales/{locale}/messages',
      include: ['src/app', 'src/components'],
      exclude: ['src/locales'],
    },
  ],
  format: 'po',
};
