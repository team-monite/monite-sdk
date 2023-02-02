import {
  CounterpartAddressResourceList,
  AllowedCountriesCodes,
} from '@team-monite/sdk-api';

export const counterpartsAddressesFixture: {
  [key: string]: CounterpartAddressResourceList;
} = {
  organization: {
    data: [
      {
        country: AllowedCountriesCodes.GE,
        city: 'City',
        postal_code: 'ZIP code',
        state: '123',
        line1: 'Address line 1',
        line2: 'Address line 2',
        id: 'aa5a332e-7af1-401f-a741-df2c494f6e47',
        is_default: true,
        counterpart_id: 'organization',
      },
    ],
  },
  individual: {
    data: [
      {
        country: AllowedCountriesCodes.GE,
        city: 'City',
        postal_code: 'ZIP code',
        state: '123',
        line1: 'Address line 1',
        line2: 'Address line 2',
        id: 'aa5a332e-7af1-401f-a741-df2c494f6e47',
        is_default: true,
        counterpart_id: 'individual',
      },
    ],
  },
  'dee7b04d-c977-449e-b5dd-93702a04f20d': {
    data: [
      {
        country: AllowedCountriesCodes.GE,
        city: 'City',
        postal_code: 'ZIP code',
        state: '123',
        line1: 'Address line 1',
        line2: 'Address line 2',
        id: 'aa5a332e-7af1-401f-a741-df2c494f6e47',
        is_default: true,
        counterpart_id: 'dee7b04d-c977-449e-b5dd-93702a04f20d',
      },
    ],
  },
  'f1b763ff-b67d-49cd-adbb-8ec84b45f4e7': {
    data: [
      {
        country: AllowedCountriesCodes.DE,
        city: 'Berlin',
        postal_code: '9999999',
        state: 'HH',
        line1: 'extra notes',
        line2: 'extra notes',
        id: 'f528e047-35e5-44bf-b950-4bf019a3fa71',
        is_default: true,
        counterpart_id: 'f1b763ff-b67d-49cd-adbb-8ec84b45f4e7',
      },
    ],
  },
  '8c4e8f4d-045e-44ea-8a64-5821e60a3b0c': {
    data: [
      {
        country: AllowedCountriesCodes.AF,
        city: 'City',
        postal_code: '22-123',
        state: 'Berlin',
        line1: 'Address line 1',
        line2: 'Address line 2',
        id: 'e14960ed-e8dd-468c-888d-20677fe0adea',
        is_default: true,
        counterpart_id: '8c4e8f4d-045e-44ea-8a64-5821e60a3b0c',
      },
    ],
  },
  '8a36db1c-da23-4a4a-8580-39040ba7fdba': {
    data: [
      {
        country: AllowedCountriesCodes.AS,
        city: 'dsa',
        postal_code: 'das',
        state: 'dsa',
        line1: 'dsa',
        line2: 'dsa',
        id: '26539b28-8165-4f81-bf1a-e0eb7989c3ea',
        is_default: true,
        counterpart_id: '8a36db1c-da23-4a4a-8580-39040ba7fdba',
      },
    ],
  },
  'daca203d-da28-46b1-9e2e-1bde053faa46': {
    data: [
      {
        country: AllowedCountriesCodes.AS,
        city: '',
        postal_code: '',
        state: '',
        line1: '',
        line2: '',
        id: '99724428-a350-4550-9ca1-05b902e0da6a',
        is_default: true,
        counterpart_id: 'daca203d-da28-46b1-9e2e-1bde053faa46',
      },
    ],
  },
};
