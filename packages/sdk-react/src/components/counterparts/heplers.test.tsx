import { getIndividualName } from '@/components/counterparts/helpers';

describe('counterparts helpers', () => {
  test('# getIndividualName(...) matches the expected behavior', () => {
    expect(getIndividualName(' ', ' ')).toBe('');
    expect(getIndividualName(undefined, undefined)).toBe('');
    expect(getIndividualName(undefined, ' Last ')).toBe('Last');
    expect(getIndividualName(' First ', undefined)).toBe('First');
    expect(
      getIndividualName({
        first_name: ' First ',
        last_name: ' Last ',
      })
    ).toBe('First Last');
    expect(
      getIndividualName({
        first_name: ' First ',
        last_name: undefined,
      })
    ).toBe('First');
    expect(
      getIndividualName({
        first_name: undefined,
        last_name: ' Last ',
      })
    ).toBe('Last');
  });
});
