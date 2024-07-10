import type { OnboardingTestData } from '@/components/onboarding/types';
import {
  AllowedCountries,
  CreateEntityBankAccountRequest,
  CurrencyEnum,
  OnboardingBankAccount,
  UpdateEntityBankAccountRequest,
} from '@monite/sdk-api';

function getBankAccount(): CreateEntityBankAccountRequest {
  return {
    country: AllowedCountries.DE,
    currency: CurrencyEnum.EUR,
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
        value: AllowedCountries.DE,
      },
      currency: {
        error: null,
        required: true,
        value: CurrencyEnum.EUR,
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
