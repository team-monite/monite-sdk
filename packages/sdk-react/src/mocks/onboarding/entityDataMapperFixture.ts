import {
  AllowedCountries,
  EntityAddressSchema,
  OnboardingEntity,
  OptionalIndividualSchema,
  OptionalOrganizationSchema,
  UpdateEntityRequest,
} from '@monite/sdk-api';

import type { OnboardingTestData } from '../../components/onboarding/types';

function getEntityByType(
  type: 'individual' | 'organization'
): UpdateEntityRequest {
  const address: EntityAddressSchema = {
    city: 'Fresno',
    country: AllowedCountries.DE,
    line1: 'Florida Well',
    line2: '8379 Quinton Stravenue',
    postal_code: '37388-5841',
    state: 'Nebraska',
  };

  const organization: OptionalOrganizationSchema = {
    legal_name: 'Monite',
  };

  const individual: OptionalIndividualSchema = {
    title: 'Block, Dickens and Graham',
    first_name: 'Vella',
    last_name: 'Fay',
    date_of_birth: '1990-12-12',
    id_number: 'MU74GHWU3185808205961009653RKD',
    ssn_last_4: '1234',
  };

  return {
    email: 'test@test.com',
    phone: '+79991112233',
    tax_id: '3b9cc1cb-974a-4874-a3ea-2051a9425712',
    address,
    ...(type === 'individual' && { individual }),
    ...(type === 'organization' && { organization }),
  };
}

export const onboardingEntityIndividualFixture = (): OnboardingTestData<
  OnboardingEntity,
  UpdateEntityRequest
> => {
  return {
    values: getEntityByType('individual'),
    fields: {
      address: {
        city: {
          error: null,
          required: true,
          value: 'Fresno',
        },
        country: {
          error: null,
          required: true,
          value: AllowedCountries.DE,
        },
        line1: {
          error: null,
          required: true,
          value: 'Florida Well',
        },
        line2: {
          error: null,
          required: true,
          value: '8379 Quinton Stravenue',
        },
        postal_code: {
          error: null,
          required: true,
          value: '37388-5841',
        },
        state: {
          error: null,
          required: true,
          value: 'Nebraska',
        },
      },
      email: {
        error: null,
        required: true,
        value: 'test@test.com',
      },
      individual: {
        date_of_birth: {
          error: null,
          required: true,
          value: '1990-12-12',
        },
        first_name: {
          error: null,
          required: true,
          value: 'Vella',
        },
        id_number: {
          error: null,
          required: true,
          value: 'MU74GHWU3185808205961009653RKD',
        },
        last_name: {
          error: null,
          required: true,
          value: 'Fay',
        },
        ssn_last_4: {
          error: null,
          required: true,
          value: '1234',
        },
        title: {
          error: null,
          required: true,
          value: 'Block, Dickens and Graham',
        },
      },
      phone: {
        error: null,
        required: true,
        value: '+79991112233',
      },
      tax_id: {
        error: null,
        required: true,
        value: '3b9cc1cb-974a-4874-a3ea-2051a9425712',
      },
    },
    errors: [],
  };
};

export const onboardingEntityIndividualMixedFixture = (): OnboardingTestData<
  OnboardingEntity,
  UpdateEntityRequest
> => {
  return {
    values: getEntityByType('individual'),
    fields: {
      address: {
        city: {
          error: null,
          required: true,
          value: 'Fresno',
        },
        country: {
          error: null,
          required: true,
          value: AllowedCountries.DE,
        },
        line1: {
          error: null,
          required: false,
          value: 'Florida Well',
        },
        postal_code: {
          error: {
            message: 'error',
          },
          required: true,
          value: '37388-5841',
        },
        state: {
          error: null,
          required: true,
          value: 'Nebraska',
        },
      },
      individual: {
        first_name: {
          error: null,
          required: true,
          value: 'Vella',
        },
        id_number: {
          error: null,
          required: false,
          value: 'MU74GHWU3185808205961009653RKD',
        },
        last_name: {
          error: null,
          required: true,
          value: 'Fay',
        },
        ssn_last_4: {
          error: null,
          required: true,
          value: '1234',
        },
        title: {
          error: null,
          required: true,
          value: 'Block, Dickens and Graham',
        },
      },
      phone: {
        error: null,
        required: false,
        value: '+79991112233',
      },
      tax_id: {
        error: null,
        required: true,
        value: '3b9cc1cb-974a-4874-a3ea-2051a9425712',
      },
    },
    errors: [
      {
        code: 'address.postal_code',
        message: 'error',
      },
    ],
  };
};

export function onboardingEntityOrganizationFixture(): OnboardingTestData<
  OnboardingEntity,
  UpdateEntityRequest
> {
  return {
    values: getEntityByType('organization'),
    fields: {
      address: {
        city: {
          error: null,
          required: true,
          value: 'Fresno',
        },
        country: {
          error: null,
          required: true,
          value: AllowedCountries.DE,
        },
        line1: {
          error: null,
          required: true,
          value: 'Florida Well',
        },
        line2: {
          error: null,
          required: true,
          value: '8379 Quinton Stravenue',
        },
        postal_code: {
          error: null,
          required: true,
          value: '37388-5841',
        },
        state: {
          error: null,
          required: true,
          value: 'Nebraska',
        },
      },
      email: {
        error: null,
        required: true,
        value: 'test@test.com',
      },
      organization: {
        legal_name: {
          error: null,
          required: true,
          value: 'Monite',
        },
      },
      phone: {
        error: null,
        required: true,
        value: '+79991112233',
      },
      tax_id: {
        error: null,
        required: true,
        value: '3b9cc1cb-974a-4874-a3ea-2051a9425712',
      },
    },
    errors: [],
  };
}

export function onboardingEntityOrganizationMixedFixture(): OnboardingTestData {
  return {
    values: getEntityByType('organization'),
    fields: {
      address: {
        city: {
          error: null,
          required: true,
          value: 'Fresno',
        },
        country: {
          error: null,
          required: true,
          value: 'DE',
        },
        line1: {
          error: null,
          required: false,
          value: 'Florida Well',
        },
        postal_code: {
          error: {
            message: 'error',
          },
          required: true,
          value: '37388-5841',
        },
        state: {
          error: null,
          required: true,
          value: 'Nebraska',
        },
      },
      organization: {
        legal_name: {
          error: null,
          required: false,
          value: 'Monite',
        },
      },
      phone: {
        error: null,
        required: false,
        value: '+79991112233',
      },
      tax_id: {
        error: null,
        required: true,
        value: '3b9cc1cb-974a-4874-a3ea-2051a9425712',
      },
    },
    errors: [
      {
        code: 'address.postal_code',
        message: 'error',
      },
    ],
  };
}
