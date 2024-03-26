import { compileLinguiDynamicMessages } from '@/utils/compile-lingui-dynamic-messages';

describe('compileLinguiDynamicMessages()', () => {
  it('compiles dynamic messages with ICU MessageFormat', async () => {
    expect(await compileLinguiDynamicMessages(plainMessages)).toEqual(
      compiledMessages
    );
  });

  it('keeps compiled ICU messages', async () => {
    const compiledICUMessages = Object.fromEntries(
      Object.entries(compiledMessages).filter(
        ([, message]) => typeof message !== 'string'
      )
    );
    expect(await compileLinguiDynamicMessages(compiledICUMessages)).toEqual(
      compiledICUMessages
    );
  });

  it('uses context for key hashing', async () => {
    expect(
      await compileLinguiDynamicMessages({
        'Hey Monkeys!': { message: 'Hey Jirafs!', context: 'animals' },
      })
    ).toEqual({ sVfpdY: 'Hey Jirafs!', 'Hey Monkeys!': 'Hey Jirafs!' });
  });
});

const plainMessages = {
  '{0, plural, zero {no apples} one {# apple} two {# apples} few {# apples} many {# apples} other {# apples}}':
    '{0, plural, zero {no monkeys} one {# monkey} two {# monkeys} few {# monkeys} many {# monkeys} other {# monkeys}}',
  'Counterpart Name': 'Contractor',
  'Hey {counters}!': 'Hey {counters}!',
};

const compiledMessages = {
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
        },
      ],
    ],
  PZQzlD: 'Contractor',
  'Counterpart Name': 'Contractor',
  vjxzEb: ['Hey ', ['counters'], '!'],
  'Hey {counters}!': ['Hey ', ['counters'], '!'],
};
