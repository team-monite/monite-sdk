import { AllowedCountries, CurrencyEnum } from '@monite/sdk-api';

import { OnboardingOutputValuesType, OnboardingTestData } from '../../../types';

export const onboardingEmptyFixture: OnboardingTestData = {
  fields: {
    country: {
      required: true,
      error: null,
      value: null,
    },
    currency: {
      required: true,
      error: null,
      value: null,
    },
    iban: {
      required: false,
      error: null,
      value: null,
    },
  },

  values: {
    country: null,
    currency: null,
    iban: null,
  },

  errors: [],
};

export const onboardingNestedFixture: OnboardingTestData = {
  fields: {
    country: {
      required: true,
      error: null,
      value: null,
    },
    nested: {
      currency: {
        required: true,
        error: null,
        value: null,
      },
      iban: {
        required: false,
        error: null,
        value: null,
      },
    },
  },

  values: {
    country: null,
    nested: {
      currency: null,
      iban: null,
    },
  },

  errors: [],
};

export const onboardingFilledNestedFixture: OnboardingTestData = {
  fields: {
    country: {
      required: true,
      error: null,
      value: AllowedCountries.DE,
    },
    nested: {
      currency: {
        required: true,
        error: null,
        value: CurrencyEnum.EUR,
      },
      iban: {
        required: false,
        error: null,
        value: 'iban',
      },
    },
  },

  values: {
    country: AllowedCountries.DE,
    nested: {
      currency: CurrencyEnum.EUR,
      iban: 'iban',
    },
  },

  errors: [],
};

export const onboardingMixedNestedFixture: OnboardingTestData = {
  fields: {
    id: '1',
    bool: false,
    country: {
      required: true,
      error: {
        message: 'error',
      },
      value: null,
    },
    nested: {
      currency: {
        required: true,
        error: {
          message: 'error 1',
        },
        value: CurrencyEnum.EUR,
      },
      date_of_birth: {
        required: false,
        error: null,
        value: '2023-11-13',
      },
      nested: {
        iban: {
          required: false,
          error: null,
          value: 'iban',
        },
        bic: {
          required: true,
          error: {
            message: 'error 2',
          },
          value: null,
        },
      },
    },
  },

  values: {
    id: '1',
    bool: false,
    country: null,
    nested: {
      currency: CurrencyEnum.EUR,
      date_of_birth: '2023-11-13',
      nested: {
        iban: 'iban',
        bic: null,
      },
    },
  },

  errors: [
    {
      code: 'country',
      message: 'error',
    },
    {
      code: 'nested.currency',
      message: 'error 1',
    },
    {
      code: 'nested.nested.bic',
      message: 'error 2',
    },
  ],
};

export const onboardingRestoreFieldsFixture: Record<
  'prevFields' | 'nextFields' | 'result',
  OnboardingOutputValuesType
> = {
  prevFields: {
    country: {
      required: true,
      error: {
        message: 'error',
      },
      value: AllowedCountries.DE,
    },
    number: {
      required: true,
      error: null,
      value: 10,
    },
    bool: false,
    nested: {
      currency: {
        required: true,
        error: null,
        value: CurrencyEnum.EUR,
      },
      iban: {
        required: false,
        error: null,
        value: 'iban',
      },
    },
  },
  nextFields: {
    country: {
      required: true,
      error: null,
      value: AllowedCountries.GB,
    },
    trueBool: true,
    number: {
      required: true,
      error: null,
      value: null,
    },
    nested: {
      currency: {
        required: true,
        error: null,
        value: null,
      },
      bic: {
        required: false,
        error: null,
        value: null,
      },
    },
  },

  result: {
    country: {
      required: true,
      error: null,
      value: AllowedCountries.GB,
    },
    trueBool: true,
    number: {
      required: true,
      error: null,
      value: null,
    },
    nested: {
      currency: {
        required: true,
        error: null,
        value: null,
      },
      bic: {
        required: false,
        error: null,
        value: null,
      },
    },
  },
};
