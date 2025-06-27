import { components } from '@/api';
import { onboardingBankAccountMixedFixture } from '@/mocks/onboarding/bankAccountDataMapperFixture';
import { waitFor } from '@testing-library/react';

import { getOnboardingValidationSchema } from '../../../onboardingTestUtils';
import { generateErrorsByFields, generateFieldsByValues } from '../../index';

describe('Onboarding bank account', () => {
  test.skip('should generate bank account with mixed fields', async () => {
    const { values, fields, errors } = onboardingBankAccountMixedFixture();

    const generatedFields = generateFieldsByValues<
      components['schemas']['OnboardingBankAccount']
    >({
      values,
      optional: ['iban'],
      exclude: ['account_holder_name'],
      errors: [
        {
          code: 'sort_code',
          message: 'error',
        },
      ],
    });

    const schema = getOnboardingValidationSchema(
      generatedFields,
      'bankAccount'
    );

    expect(generatedFields).toEqual(fields);
    expect(generateErrorsByFields(generatedFields)).toEqual(errors);
    await waitFor(() => expect(schema?.isValidSync(values)).toBeTruthy());
  });
});
