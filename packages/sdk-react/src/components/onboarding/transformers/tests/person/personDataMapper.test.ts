import { components } from '@monite/sdk-api/src/api';
import { waitFor } from '@testing-library/react';

import { getOnboardingValidationSchema } from '../../../onboardingTestUtils';
import {
  generateOptionalFields,
  generateFieldsByMask,
} from '../../../transformers';
import {
  onboardingPersonFixture,
  onboardingPersonOptionalFixture,
  personMask,
} from './personDataMapperFixture';

describe('Onboarding person', () => {
  test('should generate person fields by masks', async () => {
    const { values, fields } = onboardingPersonFixture();

    const generatedFields = generateFieldsByMask<OnboardingPerson>(personMask);

    const schema = getOnboardingValidationSchema(generatedFields, 'person');

    expect(generatedFields).toEqual(fields);
    await waitFor(() => expect(schema?.isValidSync(values)).toBeFalsy());
  });

  test('should generate optional person fields by masks', async () => {
    const { values, fields } = onboardingPersonOptionalFixture();

    const generatedFields = generateOptionalFields({
      fields: generateFieldsByMask<OnboardingPerson>(personMask),
      exclude: ['phone', 'address.city', 'relationship.director'],
      optional: ['first_name', 'last_name'],
      errors: [
        {
          code: 'email',
          message: 'email is required',
        },
        {
          code: 'date_of_birth',
          message: 'date_of_birth is required',
        },
      ],
    });

    const schema = getOnboardingValidationSchema(generatedFields, 'person');

    expect(generatedFields).toEqual(fields);
    await waitFor(() => expect(schema?.isValidSync(values)).toBeFalsy());
  });
});

type OnboardingPerson = components['schemas']['OnboardingPerson'];
