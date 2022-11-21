import {
  AllowedCountriesCodes,
  CounterpartIndividualResponse,
  CounterpartOrganizationResponse,
  CounterpartType,
} from '@team-monite/sdk-api';

export const counterpartOrganizationFixture: CounterpartOrganizationResponse = {
  id: 'organization',
  created_at: '2022-05-20T14:37:04.383441+00:00',
  updated_at: '2022-05-20T14:37:04.383455+00:00',
  type: CounterpartType.ORGANIZATION,
  organization: {
    legal_name: 'SMART Agency',
    vat_number: 'vat_number1',
    is_vendor: true,
    is_customer: true,
    phone: '+31 6 12 34 56 78',
    email: 'zachary.walters@hotmail.com',
    registered_address: {
      country: AllowedCountriesCodes.AF,
      city: 'Berlin',
      postal_code: 'code123',
      state: 'state',
      line1: 'line1',
      line2: 'line2',
    },
    contacts: [],
  },
};

export const counterpartIndividualFixture: CounterpartIndividualResponse = {
  id: 'individual',
  created_at: '2022-05-22T20:09:17.890428+00:00',
  updated_at: '2022-05-22T20:09:17.890440+00:00',
  type: CounterpartType.INDIVIDUAL,
  individual: {
    first_name: 'Nikolay',
    last_name: 'Murzin',
    is_vendor: true,
    is_customer: true,
    phone: '+31 6 12 34 56 78',
    email: 'john@mixmax.com',
    residential_address: {
      country: AllowedCountriesCodes.NE,
      city: 'Amsterdam',
      postal_code: 'code123',
      state: 'state',
      line1: 'line1',
      line2: 'line2',
    },
  },
};
