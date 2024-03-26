import { OnboardingBankAccount } from '@monite/sdk-api';
import { waitFor } from '@testing-library/react';

import { getOnboardingValidationSchema } from '../../../onboardingTestUtils';
import { generateErrorsByFields, generateFieldsByValues } from '../../index';
import { onboardingBankAccountMixedFixture } from './bankAccountDataMapperFixture';

describe('Onboarding bank account', () => {
  test('should generate bank account with mixed fields', async () => {
    const { values, fields, errors } = onboardingBankAccountMixedFixture();

    const generatedFields = generateFieldsByValues<OnboardingBankAccount>({
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
