import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint';

import * as rule from '../../rules/use-double-bang-for-enabled';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('use-double-bang-for-enabled', rule, {
  valid: [
    {
      code: `const obj = { enabled: true };`,
    },
    {
      code: `const obj = { enabled: false };`,
    },
    {
      code: `const obj = { enabled: someBooleanFunction() };`,
    },
    {
      code: `const obj = { enabled: !!id };`,
    },
    {
      code: `const obj = { enabled: someOtherValue };`,
    },
    {
      code: `const obj = { enabled: id ? true : false };`,
    },
  ],

  invalid: [
    {
      code: `const obj = { enabled: Boolean(id) };`,
      errors: [{ messageId: 'useDoubleBang' }],
      output: `const obj = { enabled: !!id };`,
    },
    {
      code: `const obj = { enabled: Boolean(someValue) };`,
      errors: [{ messageId: 'useDoubleBang' }],
      output: `const obj = { enabled: !!someValue };`,
    },
    {
      code: `const obj = { enabled: Boolean(obj.id) };`,
      errors: [{ messageId: 'useDoubleBang' }],
      output: `const obj = { enabled: !!obj.id };`,
    },
  ],
});
