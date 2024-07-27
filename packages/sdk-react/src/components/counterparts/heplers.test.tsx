import {
  getCounterpartName,
  getIndividualName,
} from '@/components/counterparts/helpers';
import {
  counterpartIndividualFixture,
  counterpartOrganizationFixture,
} from '@/mocks';

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

  test('# getCounterpartName(...)', () => {
    expect(getCounterpartName(counterpartOrganizationFixture)).toBe(
      counterpartOrganizationFixture.organization.legal_name
    );

    expect(getCounterpartName(counterpartIndividualFixture)).toBe(
      `${counterpartIndividualFixture.individual.first_name} ${counterpartIndividualFixture.individual.last_name}`
    );

    expect(
      getCounterpartName({
        ...counterpartOrganizationFixture,
        organization: {
          ...counterpartOrganizationFixture.organization,
          legal_name: '',
        },
      })
    ).toBe('');

    expect(
      getCounterpartName({
        ...counterpartIndividualFixture,
        individual: {
          ...counterpartIndividualFixture.individual,
          first_name: '',
          last_name: '',
        },
      })
    ).toBe('');

    expect(
      getCounterpartName(
        // @ts-expect-error - checking invalid payload without `individual` or `organization` properties
        {}
      )
    ).toBe('');

    expect(getCounterpartName(undefined)).toBe('');
  });
});
