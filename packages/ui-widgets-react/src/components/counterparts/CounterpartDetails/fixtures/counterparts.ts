import { CounterpartType, AllowedCountriesCodes } from '@team-monite/sdk-api';

export const counterpartOrganization = {
  id: '44ac3882-1d32-415e-a3bb-fa375c576855',
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
    contacts: [
      {
        first_name: 'John Doe',
        last_name: 'last_name',
        email: 'user@example.com',
        phone: '123',
        is_default: true,
        address: {
          country: AllowedCountriesCodes.AF,
          city: 'city',
          postal_code: 'code123',
          state: 'state',
          line1: 'line1',
          line2: 'line2',
        },
        title: 'string',
      },
    ],
  },
};

export const contactsOrganization = [
  {
    first_name: 'John',
    last_name: 'Doe',
    email: 'company_x_1@mailnesia.com',
    phone: '00000',
    address: {
      country: 'DE',
      city: 'City_2',
      postal_code: '22-123_1',
      state: 'Berlin',
      line1: 'Address line 1_1',
      line2: 'Address line 2_2',
    },
    title: null,
    id: 'bf537f1c-c092-47eb-8a6a-4b0d88bfc7cf',
    counterpart_id: '44ac3882-1d32-415e-a3bb-fa375c576855',
  },
];

export const banksAccountsOrganization = {
  data: [
    {
      iban: 'DE123456789-0',
      bic: 'SDADEDE',
      name: 'Project X',
      id: 'b5b5c1b4-4ced-4cd3-9c34-87e7aeaa0eb2',
      counterpart_id: 'c25fddc6-7558-440e-8810-c9e970e6d3e9',
    },
  ],
};

export const counterpartIndividual = {
  id: 'dbe1aa12-6960-4e44-a5b0-f2a931a077c7',
  created_at: '2022-05-22T20:09:17.890428+00:00',
  updated_at: '2022-05-22T20:09:17.890440+00:00',
  type: CounterpartType.INDIVIDUAL,
  individual: {
    first_name: 'Nikolay',
    last_name: 'Murzin',
    // title: null,
    is_vendor: true,
    is_customer: true,
    phone: '+31 6 12 34 56 78',
    email: 'john@mixmax.com',
    // tax_id: null,
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
