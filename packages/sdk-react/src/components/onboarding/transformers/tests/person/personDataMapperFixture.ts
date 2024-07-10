import { components } from '@/api';

import type { RecursivePartial, OnboardingTestData } from '../../../types';

export const personMask: OnboardingPersonMask = {
  first_name: true,
  last_name: true,
  email: true,
  date_of_birth: true,
  phone: true,
  id_number: true,
  ssn_last_4: true,
  address: {
    country: true,
    line1: true,
    line2: true,
    postal_code: true,
    city: true,
    state: true,
  },
  relationship: {
    title: true,
    representative: true,
    owner: true,
    executive: true,
    director: true,
    percent_ownership: true,
  },
};

function getPerson(): OptionalPersonRequest {
  const address: OptionalPersonAddress = {
    city: '',
    country: undefined,
    line1: '',
    line2: '',
    postal_code: '',
    state: '',
  };

  const relationship: OptionalPersonRelationship = {
    title: '',
    representative: false,
    executive: false,
    director: false,
    owner: false,
    percent_ownership: 0,
  };

  return {
    date_of_birth: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_number: '',
    ssn_last_4: '',
    address,
    relationship,
  };
}

export const onboardingPersonFixture = (): OnboardingTestData<
  RecursivePartial<OnboardingPerson>,
  OptionalPersonRequest
> => {
  return {
    values: getPerson(),
    fields: {
      address: {
        city: {
          error: null,
          required: true,
          value: null,
        },
        country: {
          error: null,
          required: true,
          value: null,
        },
        line1: {
          error: null,
          required: true,
          value: null,
        },
        line2: {
          error: null,
          required: true,
          value: null,
        },
        postal_code: {
          error: null,
          required: true,
          value: null,
        },
        state: {
          error: null,
          required: true,
          value: null,
        },
      },
      date_of_birth: {
        error: null,
        required: true,
        value: null,
      },
      email: {
        error: null,
        required: true,
        value: null,
      },
      first_name: {
        error: null,
        required: true,
        value: null,
      },
      id_number: {
        error: null,
        required: true,
        value: null,
      },
      last_name: {
        error: null,
        required: true,
        value: null,
      },
      phone: {
        error: null,
        required: true,
        value: null,
      },
      relationship: {
        director: false,
        executive: false,
        owner: false,
        percent_ownership: {
          error: null,
          required: true,
          value: null,
        },
        representative: false,
        title: {
          error: null,
          required: true,
          value: null,
        },
      },
      ssn_last_4: {
        error: null,
        required: true,
        value: null,
      },
    },
    errors: [],
  };
};

export const onboardingPersonOptionalFixture = (): OnboardingTestData<
  Omit<RecursivePartial<OnboardingPerson>, 'id'>,
  OptionalPersonRequest
> => {
  return {
    values: getPerson(),
    fields: {
      address: {
        country: {
          error: null,
          required: true,
          value: null,
        },
        line1: {
          error: null,
          required: true,
          value: null,
        },
        line2: {
          error: null,
          required: true,
          value: null,
        },
        postal_code: {
          error: null,
          required: true,
          value: null,
        },
        state: {
          error: null,
          required: true,
          value: null,
        },
      },
      date_of_birth: {
        error: {
          message: 'date_of_birth is required',
        },
        required: true,
        value: null,
      },
      email: {
        error: {
          message: 'email is required',
        },
        required: true,
        value: null,
      },
      first_name: {
        error: null,
        required: false,
        value: null,
      },
      id_number: {
        error: null,
        required: true,
        value: null,
      },
      last_name: {
        error: null,
        required: false,
        value: null,
      },
      relationship: {
        executive: false,
        owner: false,
        representative: false,
        percent_ownership: {
          error: null,
          required: true,
          value: null,
        },
        title: {
          error: null,
          required: true,
          value: null,
        },
      },
      ssn_last_4: {
        error: null,
        required: true,
        value: null,
      },
    },
    errors: [],
  };
};

type OnboardingPerson = components['schemas']['OnboardingPerson'];
type OnboardingPersonMask = components['schemas']['OnboardingPersonMask'];
type OptionalPersonAddress = components['schemas']['OptionalPersonAddress'];
type OptionalPersonRelationship =
  components['schemas']['OptionalPersonRelationship'];
type OptionalPersonRequest = components['schemas']['OptionalPersonRequest'];
