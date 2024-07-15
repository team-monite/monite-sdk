import {
  onboardingEntityIndividualFixture,
  onboardingEntityIndividualMixedFixture,
  onboardingEntityOrganizationFixture,
  onboardingEntityOrganizationMixedFixture,
} from '@/mocks/onboarding/entityDataMapperFixture';
import { waitFor } from '@testing-library/react';

import { getOnboardingValidationSchema } from '../../../onboardingTestUtils';
import { generateErrorsByFields, generateFieldsByValues } from '../../index';

describe('Onboarding entity', () => {
  describe('Individual Entity', () => {
    test('should generate individual entity fields', async () => {
      const { values, fields, errors } = onboardingEntityIndividualFixture();

      const generatedFields = generateFieldsByValues({
        values,
      });

      const schema = getOnboardingValidationSchema(generatedFields, 'entity');

      expect(generatedFields).toEqual(fields);
      expect(generateErrorsByFields(generatedFields)).toEqual(errors);

      await waitFor(() => expect(schema?.isValidSync(values)).toBeTruthy());
    });

    test('should generate individual entity with mixed fields', async () => {
      const { values, fields, errors } =
        onboardingEntityIndividualMixedFixture();

      const generatedFields = generateFieldsByValues({
        values,
        exclude: ['email', 'individual.date_of_birth', 'address.line2'],
        optional: ['phone', 'individual.id_number', 'address.line1'],
        errors: [
          {
            code: 'address.postal_code',
            message: 'error',
          },
        ],
      });

      const schema = getOnboardingValidationSchema(generatedFields, 'entity');

      expect(generatedFields).toEqual(fields);
      expect(generateErrorsByFields(generatedFields)).toEqual(errors);

      await waitFor(() => expect(schema?.isValidSync(values)).toBeTruthy());
    });
  });

  describe('Organization Entity', () => {
    test('should generate organization entity fields', async () => {
      const { values, fields, errors } = onboardingEntityOrganizationFixture();

      const generatedFields = generateFieldsByValues({
        values,
      });

      const schema = getOnboardingValidationSchema(generatedFields, 'entity');

      expect(generatedFields).toEqual(fields);
      expect(generateErrorsByFields(generatedFields)).toEqual(errors);

      await waitFor(() => expect(schema?.isValidSync(values)).toBeTruthy());
    });

    test('should generate organization entity with mixed fields', async () => {
      const { values, fields, errors } =
        onboardingEntityOrganizationMixedFixture();

      const generatedFields = generateFieldsByValues({
        values,
        exclude: ['email', 'address.line2'],
        optional: ['phone', 'organization.legal_name', 'address.line1'],
        errors: [
          {
            code: 'address.postal_code',
            message: 'error',
          },
        ],
      });

      const schema = getOnboardingValidationSchema(generatedFields, 'entity');

      expect(generatedFields).toEqual(fields);
      expect(generateErrorsByFields(generatedFields)).toEqual(errors);

      await waitFor(() => expect(schema?.isValidSync(values)).toBeTruthy());
    });
  });
});
