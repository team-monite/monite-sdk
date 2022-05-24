import {
  generateErrorsByFields,
  enrichFieldsByValues,
  generateValuesByFields,
  isOnboardingField,
  mapValueToForm,
  restoreFields,
} from '../../index';
import {
  onboardingEmptyFixture,
  onboardingFilledNestedFixture,
  onboardingMixedNestedFixture,
  onboardingNestedFixture,
  onboardingRestoreFieldsFixture,
} from './commonDataMapperFixture';

describe('Onboarding common data mapper', () => {
  describe('isOnboardingField', () => {
    it('returns true when field is an OnboardingField', () => {
      expect(isOnboardingField({ required: true, value: null })).toBe(true);
    });

    it('returns true if the required parameter is false, is OnboardingField', () => {
      expect(isOnboardingField({ required: false, value: null })).toBe(true);
    });

    it('returns false when field is a boolean', () => {
      expect(isOnboardingField(false)).toBe(false);
    });
  });

  describe('mapValueToForm', () => {
    it('returns null when value is undefined', () => {
      expect(mapValueToForm('key', undefined)).toBe(null);
    });

    it('returns value when key is not date_of_birth and value is a string', () => {
      expect(mapValueToForm('key', 'value')).toBe('value');
    });
  });

  describe('restoreFields', () => {
    it('should restore fields', () => {
      const { prevFields, nextFields, result } = onboardingRestoreFieldsFixture;

      expect(restoreFields(prevFields, nextFields)).toStrictEqual(result);
    });
  });

  describe('Empty values', () => {
    test('should generate empty values', () => {
      const values = generateValuesByFields(onboardingEmptyFixture.fields);

      expect(values).toEqual(onboardingEmptyFixture.values);
    });

    test('should generate fields with empty values', () => {
      const fields = enrichFieldsByValues(
        onboardingEmptyFixture.fields,
        onboardingEmptyFixture.values
      );

      expect(fields).toEqual(onboardingEmptyFixture.fields);
    });

    test('should generate errors by empty fields', () => {
      const values = generateErrorsByFields(onboardingEmptyFixture.fields);

      expect(values).toEqual(onboardingEmptyFixture.errors);
    });
  });

  describe('Nested empty values', () => {
    test('should generate nested values', () => {
      const values = generateValuesByFields(onboardingNestedFixture.fields);

      expect(values).toEqual(onboardingNestedFixture.values);
    });

    test('should generate fields with nested values', () => {
      const fields = enrichFieldsByValues(
        onboardingNestedFixture.fields,
        onboardingNestedFixture.values
      );

      expect(fields).toEqual(onboardingNestedFixture.fields);
    });

    test('should generate errors by nested fields', () => {
      const values = generateErrorsByFields(onboardingNestedFixture.fields);

      expect(values).toEqual(onboardingNestedFixture.errors);
    });
  });

  describe('Nested filled values', () => {
    test('should generate filled nested values', () => {
      const values = generateValuesByFields(
        onboardingFilledNestedFixture.fields
      );

      expect(values).toEqual(onboardingFilledNestedFixture.values);
    });

    test('should generate fields with filled nested values', () => {
      const fields = enrichFieldsByValues(
        onboardingFilledNestedFixture.fields,
        onboardingFilledNestedFixture.values
      );

      expect(fields).toEqual(onboardingFilledNestedFixture.fields);
    });

    test('should generate errors  by filled nested fields', () => {
      const values = generateErrorsByFields(
        onboardingFilledNestedFixture.fields
      );

      expect(values).toEqual(onboardingFilledNestedFixture.errors);
    });
  });

  describe('Mixed nested values', () => {
    test('should generate mixed nested values', () => {
      const values = generateValuesByFields(
        onboardingMixedNestedFixture.fields
      );

      expect(values).toEqual(onboardingMixedNestedFixture.values);
    });

    test.skip('should generate fields with mixed nested values', () => {
      const fields = enrichFieldsByValues(
        onboardingMixedNestedFixture.fields,
        onboardingMixedNestedFixture.values
      );

      expect(fields).toEqual(onboardingMixedNestedFixture.fields);
    });

    test('should generate errors by mixed nested fields', () => {
      const values = generateErrorsByFields(
        onboardingMixedNestedFixture.fields
      );

      expect(values).toEqual(onboardingMixedNestedFixture.errors);
    });
  });
});
