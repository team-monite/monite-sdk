import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint';

import * as rule from '../../rules/use-boolean-for-enabled';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('use-boolean-for-enabled', rule, {
  valid: [
    {
      code: `const obj = { enabled: Boolean(id) };`,
    },
    {
      code: `const obj = { enabled: Boolean(someValue) };`,
    },
    {
      code: `const obj = { enabled: true };`,
    },
    {
      code: `const obj = { enabled: false };`,
    },
    {
      code: `const obj = { enabled: someValue };`,
    },
    {
      code: `const obj = { enabled: Boolean(obj.id) };`,
    },
  ],

  invalid: [
    {
      code: `const obj = { enabled: !!id };`,
      errors: [{ messageId: 'useBoolean' }],
      output: `const obj = { enabled: Boolean(id) };`,
    },
    {
      code: `const obj = { enabled: !!someValue };`,
      errors: [{ messageId: 'useBoolean' }],
      output: `const obj = { enabled: Boolean(someValue) };`,
    },
    {
      code: `const obj = { enabled: !!obj.id };`,
      errors: [{ messageId: 'useBoolean' }],
      output: `const obj = { enabled: Boolean(obj.id) };`,
    },
  ],
});
