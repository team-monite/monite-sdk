import type { OnboardingTestData } from '@/components/onboarding/types';
import { components } from '@monite/sdk-api/src/api';

function getBankAccount(): Omit<
  CreateEntityBankAccountRequest,
  // `is_default_for_currency` was not added to the `OnboardingBankAccount` schema
  'is_default_for_currency'
> {
  return {
    country: 'DE',
    currency: 'EUR',
    account_holder_name: 'John Doe',
    iban: 'DE89370400440532013000',
    account_number: 'DE89370400440532013000',
    sort_code: 'DE89370400440532013000',
  };
}

export const onboardingBankAccountMixedFixture = (): OnboardingTestData<
  OnboardingBankAccount,
  UpdateEntityBankAccountRequest
> => {
  return {
    values: getBankAccount(),
    fields: {
      account_number: {
        error: null,
        required: true,
        value: 'DE89370400440532013000',
      },
      country: {
        error: null,
        required: true,
        value: 'DE',
      },
      currency: {
        error: null,
        required: true,
        value: 'EUR',
      },
      iban: {
        error: null,
        required: false,
        value: 'DE89370400440532013000',
      },
      sort_code: {
        error: {
          message: 'error',
        },
        required: true,
        value: 'DE89370400440532013000',
      },
    } as OnboardingBankAccount,
    errors: [
      {
        code: 'sort_code',
        message: 'error',
      },
    ],
  };
};

type CreateEntityBankAccountRequest =
  components['schemas']['CreateEntityBankAccountRequest'];
type OnboardingBankAccount = components['schemas']['OnboardingBankAccount'];
type UpdateEntityBankAccountRequest =
  components['schemas']['UpdateEntityBankAccountRequest'];
