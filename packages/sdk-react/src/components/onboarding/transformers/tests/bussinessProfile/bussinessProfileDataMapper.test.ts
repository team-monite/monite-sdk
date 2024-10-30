import { components } from '@monite/sdk-api/src/api';
import { waitFor } from '@testing-library/react';

import { getOnboardingValidationSchema } from '../../../onboardingTestUtils';
import { generateErrorsByFields, generateFieldsByValues } from '../../index';
import { onboardingBusinessProfileMixedFixture } from './bussinessProfileDataMapperFixture';

describe('Onboarding business profile', () => {
  test('should generate business profile with mixed fields', async () => {
    const { values, fields, errors } = onboardingBusinessProfileMixedFixture();

    const generatedFields = generateFieldsByValues<
      Omit<
        components['schemas']['OnboardingBusinessProfile'],
        'operating_countries'
      >
    >({
      values,
      optional: ['url'],
      errors: [
        {
          code: 'mcc',
          message: 'error',
        },
      ],
    });

    const schema = getOnboardingValidationSchema(
      generatedFields,
      'businessProfile'
    );

    expect(generatedFields).toEqual(fields);
    expect(generateErrorsByFields(generatedFields)).toEqual(errors);
    await waitFor(() => expect(schema?.isValidSync(values)).toBeTruthy());
  });
});
