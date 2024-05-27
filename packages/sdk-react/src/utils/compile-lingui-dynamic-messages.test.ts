import {
  compileLinguiDynamicMessages,
  generateLinguiMessageId,
} from '@/utils/compile-lingui-dynamic-messages';

describe('compileLinguiDynamicMessages()', () => {
  test('compiles dynamic messages with ICU MessageFormat', async () => {
    expect(compileLinguiDynamicMessages(plainMessages)).toEqual(
      compiledMessages
    );
  });

  test('keeps compiled ICU messages', async () => {
    const compiledICUMessages = Object.fromEntries(
      Object.entries(compiledMessages).filter(
        ([, message]) => typeof message !== 'string'
      )
    );
    expect(compileLinguiDynamicMessages(compiledICUMessages)).toEqual(
      compiledICUMessages
    );
  });

  test('uses multiple context for key hashing', async () => {
    expect(
      compileLinguiDynamicMessages({
        'Hey Monkeys!': [
          { msgstr: 'Hey Jirafs!', msgctxt: 'animals' },
          { msgstr: 'Hey Elephant!', msgctxt: 'giant-animals' },
        ],
      })
    ).toEqual({
      [generateLinguiMessageId('Hey Monkeys!', 'animals')]: 'Hey Jirafs!',
      [generateLinguiMessageId('Hey Monkeys!', 'giant-animals')]:
        'Hey Elephant!',
    });
  });

  test('uses single context for key hashing', async () => {
    expect(
      compileLinguiDynamicMessages({
        'Hey Monkeys!': { msgstr: 'Hey Jirafs!', msgctxt: 'animals' },
      })
    ).toEqual({
      [generateLinguiMessageId('Hey Monkeys!', 'animals')]: 'Hey Jirafs!',
    });
  });

  test('uses msgstr if no msgctxt specified', async () => {
    expect(
      compileLinguiDynamicMessages({
        'ZIP code': { msgstr: 'My ZIP code' },
      })
    ).toEqual({
      [generateLinguiMessageId('ZIP code', undefined)]: 'My ZIP code',
      'ZIP code': 'My ZIP code',
    });
  });

  test('hashes the "msgid" with the "msgctx"', async () => {
    expect(generateLinguiMessageId('Hey Monkeys!', 'animals')).toEqual(
      'sVfpdY'
    );
  });

  test('hashes the "msgid" without the "msgctx"', async () => {
    expect(generateLinguiMessageId('ZIP code', undefined)).toEqual('pVZUS0');
  });
});

const plainMessages = {
  '{0, plural, zero {no apples} one {# apple} two {# apples} few {# apples} many {# apples} other {# apples}}':
    '{0, plural, zero {no monkeys} one {# monkey} two {# monkeys} few {# monkeys} many {# monkeys} other {# monkeys}}',
  'Counterpart Name': 'Contractor',
  'Hey {counters}!': 'Hey {counters}!',
  'ZIP code': 'ZIP code',
};

const compiledMessages = {
  // Hashed keys is the result of the `generateLinguiMessageId(...)` function
  NelGC6: [
    [
      '0',
      'plural',
      {
        zero: 'no monkeys',
        one: ['#', ' monkey'],
        two: ['#', ' monkeys'],
        few: ['#', ' monkeys'],
        many: ['#', ' monkeys'],
        other: ['#', ' monkeys'],
        offset: undefined,
      },
    ],
  ],
  '{0, plural, zero {no apples} one {# apple} two {# apples} few {# apples} many {# apples} other {# apples}}':
    [
      [
        '0',
        'plural',
        {
          zero: 'no monkeys',
          one: ['#', ' monkey'],
          two: ['#', ' monkeys'],
          few: ['#', ' monkeys'],
          many: ['#', ' monkeys'],
          other: ['#', ' monkeys'],
          offset: undefined,
        },
      ],
    ],
  PZQzlD: 'Contractor',
  'Counterpart Name': 'Contractor',
  vjxzEb: ['Hey ', ['counters'], '!'],
  'Hey {counters}!': ['Hey ', ['counters'], '!'],
  pVZUS0: 'ZIP code',
  'ZIP code': 'ZIP code',
};
