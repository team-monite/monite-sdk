import {
  AllowedCountries,
  CurrencyEnum,
  OnboardingBankAccount,
} from '@monite/sdk-api';

export const onboardingBankAccountFixture = (): OnboardingBankAccount => {
  return {
    id: 'test',
    country: {
      value: AllowedCountries.US,
      required: true,
      error: null,
    },
    currency: {
      value: CurrencyEnum.USD,
      required: true,
      error: null,
    },
    account_holder_name: {
      value: 'account_holder_name',
      required: true,
      error: {
        message: 'error',
      },
    },
    account_number: {
      value: 'account_number',
      required: true,
      error: {
        message: 'error',
      },
    },
    routing_number: {
      value: 'routing_number',
      required: true,
      error: null,
    },
  };
};
