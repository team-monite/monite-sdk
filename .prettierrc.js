module.exports = {
  singleQuote: true,
  bracketSpacing: true,
  trailingComma: 'es5',
  importOrderCaseInsensitive: true,
  importOrderSeparation: true,
  importOrder: ['^react(.*)$', '^@(.*)$', '<THIRD_PARTY_MODULES>', '^[./]'],
  importOrderParserPlugins: ['importAssertions', 'typescript', 'jsx'],
};
