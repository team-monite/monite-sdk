import { components } from '@monite/sdk-api/src/api';

export const onboardingBankAccountFixture = (): OnboardingBankAccount => {
  return {
    id: 'test',
    country: {
      value: 'US',
      required: true,
      error: null,
    },
    currency: {
      value: 'USD',
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

type OnboardingBankAccount = components['schemas']['OnboardingBankAccount'];
