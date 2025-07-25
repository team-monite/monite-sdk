import { CounterpartResponse } from '@/core/queries';
import { getIndividualName } from '@/core/utils';
import {
  counterpartIndividualFixture,
  counterpartOrganizationFixture,
} from '@/mocks';

import { getCounterpartName } from './helpers';

describe('counterparts helpers', () => {
  describe('getIndividualName', () => {
    test('returns empty string when both first name and last name are empty strings', () => {
      expect(getIndividualName(' ', ' ')).toBe('');
    });

    test('returns empty string when both first name and last name are undefined', () => {
      expect(getIndividualName(undefined, undefined)).toBe('');
    });

    test('returns only last name when first name is undefined', () => {
      expect(getIndividualName(undefined, ' Last ')).toBe('Last');
    });

    test('returns only first name when last name is undefined', () => {
      expect(getIndividualName(' First ', undefined)).toBe('First');
    });

    test('returns full name when both first and last name are provided', () => {
      expect(getIndividualName(' First ', ' Last ')).toBe('First Last');
    });

    test('properly trims whitespace from both names', () => {
      expect(getIndividualName('  John  ', '  Doe  ')).toBe('John Doe');
    });

    test('handles object parameter with both names', () => {
      expect(
        getIndividualName({
          first_name: ' First ',
          last_name: ' Last ',
        })
      ).toBe('First Last');
    });

    test('handles object parameter with only first name', () => {
      expect(
        getIndividualName({
          first_name: ' First ',
          last_name: undefined,
        })
      ).toBe('First');
    });

    test('handles object parameter with only last name', () => {
      expect(
        getIndividualName({
          first_name: undefined,
          last_name: ' Last ',
        })
      ).toBe('Last');
    });

    test('handles object parameter with null values', () => {
      expect(
        getIndividualName({
          first_name: null as unknown as undefined,
          last_name: null as unknown as undefined,
        })
      ).toBe('');
    });
  });

  describe('getCounterpartName', () => {
    test('returns organization legal name for organization counterpart', () => {
      expect(getCounterpartName(counterpartOrganizationFixture)).toBe(
        counterpartOrganizationFixture.organization.legal_name
      );
    });

    test('returns combined first and last name for individual counterpart', () => {
      expect(getCounterpartName(counterpartIndividualFixture)).toBe(
        `${counterpartIndividualFixture.individual.first_name} ${counterpartIndividualFixture.individual.last_name}`
      );
    });

    test('returns empty string for organization with empty legal name', () => {
      expect(
        getCounterpartName({
          ...counterpartOrganizationFixture,
          organization: {
            ...counterpartOrganizationFixture.organization,
            legal_name: '',
          },
        })
      ).toBe('');
    });

    test('returns empty string for individual with empty first and last name', () => {
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
    });

    test('returns empty string for invalid counterpart without type properties', () => {
      expect(getCounterpartName({} as unknown as CounterpartResponse)).toBe('');
    });

    test('returns empty string for undefined counterpart', () => {
      expect(getCounterpartName(undefined)).toBe('');
    });

    test('returns empty string for null counterpart', () => {
      expect(getCounterpartName(null as unknown as undefined)).toBe('');
    });
  });
});
