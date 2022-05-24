import { RuleTester } from '@typescript-eslint/utils/dist/ts-eslint';

import * as rule from '../../rules/lingui-require-argument-for-t-function';

const ruleTester = new RuleTester({
  parser: require.resolve('@typescript-eslint/parser'),
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
});

const errors = [{ messageId: 'default' }];

ruleTester.run<string, readonly unknown[]>(
  'lingui-require-argument-for-t-function',
  rule as never,
  {
    valid: [
      {
        code: 't(i18n)`Hello!`',
      },
    ],

    invalid: [
      { code: 't`Hello!`', errors },
      { code: 't()`Hello!`', errors },
    ],
  }
);
