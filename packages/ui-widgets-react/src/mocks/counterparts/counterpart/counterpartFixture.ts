import {
  CounterpartIndividualRootResponse,
  CounterpartOrganizationRootResponse,
  CounterpartResponse,
  CounterpartType,
} from '@team-monite/sdk-api';

export const counterpartOrganizationFixture: CounterpartOrganizationRootResponse =
  {
    id: 'organization',
    created_at: '2022-05-20T14:37:04.383441+00:00',
    updated_at: '2022-05-20T14:37:04.383455+00:00',
    type: CounterpartType.ORGANIZATION,
    organization: {
      legal_name: 'SMART Agency',
      is_vendor: true,
      is_customer: true,
      phone: '+31 6 12 34 56 78',
      email: 'zachary.walters@hotmail.com',
    },
  };

export const counterpartIndividualFixture: CounterpartIndividualRootResponse = {
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
  },
};

export const counterpartListFixture: CounterpartResponse[] = [
  {
    id: 'dee7b04d-c977-449e-b5dd-93702a04f20d',
    created_at: '2022-10-21T12:45:22.510995+00:00',
    updated_at: '2022-10-21T12:45:22.511009+00:00',
    type: CounterpartType.ORGANIZATION,
    created_automatically: false,
    organization: {
      legal_name: 'Acme Inc. 11222123123',
      is_vendor: false,
      is_customer: true,
      phone: '8889',
      email: 'nikita.tokarev@monite.com',
    },
  },
  {
    id: 'f1b763ff-b67d-49cd-adbb-8ec84b45f4e7',
    created_at: '2022-11-02T16:52:10.705564+00:00',
    updated_at: '2022-11-02T16:52:10.705575+00:00',
    type: CounterpartType.INDIVIDUAL,
    created_automatically: false,
    individual: {
      first_name: 'Ololo',
      last_name: 'Test',
      title: 'test',
      is_vendor: true,
      is_customer: false,
      phone: '7999999999',
      email: 'qa-team@monite.com',
    },
  },
  {
    id: '8c4e8f4d-045e-44ea-8a64-5821e60a3b0c',
    created_at: '2022-10-24T17:50:47.728743+00:00',
    updated_at: '2022-10-24T17:51:32.516228+00:00',
    type: CounterpartType.ORGANIZATION,
    created_automatically: false,
    organization: {
      legal_name: 'Company #2',
      is_vendor: false,
      is_customer: true,
      phone: 'dsafas',
      email: 'company_x_1_2@mailnesia.com',
    },
  },
  {
    id: '8a36db1c-da23-4a4a-8580-39040ba7fdba',
    created_at: '2022-10-24T17:54:21.694756+00:00',
    updated_at: '2022-10-24T17:55:49.313133+00:00',
    type: CounterpartType.ORGANIZATION,
    created_automatically: false,
    organization: {
      legal_name: 'dsa',
      is_vendor: false,
      is_customer: true,
      phone: 'sadasdas',
      email: 'das@dsa.dsa',
    },
  },
  {
    id: 'daca203d-da28-46b1-9e2e-1bde053faa46',
    created_at: '2022-10-24T18:03:02.961297+00:00',
    updated_at: '2022-10-24T18:03:02.961310+00:00',
    type: CounterpartType.ORGANIZATION,
    created_automatically: false,
    organization: {
      legal_name: '',
      is_vendor: false,
      is_customer: false,
      phone: '',
      email: 'qwe@qwe.da',
    },
  },
];
