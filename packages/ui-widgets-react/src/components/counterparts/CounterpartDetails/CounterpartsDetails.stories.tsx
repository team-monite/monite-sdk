import CounterpartsDetails from './CounterpartsDetails';
import { CounterpartType } from '@team-monite/sdk-api';
import withMock from 'storybook-addon-mock';
import {
  counterpartOrganization,
  counterpartIndividual,
  contactsOrganization,
  banksAccountsOrganization,
} from './fixtures/counterparts';

const Story = {
  title: 'Counterparts/Counterparts — Details',
  component: CounterpartsDetails,
  decorators: [withMock],
  parameters: {
    mockData: [
      {
        url: 'https://api.dev.monite.com/v1/counterparts/b8784fb4-1b33-433f-aa6d-57e137e9d34f',
        method: 'GET',
        status: 200,
        response: counterpartOrganization,
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/44ac3882-1d32-415e-a3bb-fa375c576855',
        method: 'PATCH',
        status: 200,
        response: counterpartOrganization,
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/b8784fb4-1b33-433f-aa6d-57e137e9d34f/contacts/bf537f1c-c092-47eb-8a6a-4b0d88bfc7cf',
        method: 'PATCH',
        status: 200,
        response: contactsOrganization[0],
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/44ac3882-1d32-415e-a3bb-fa375c576855/contacts/bf537f1c-c092-47eb-8a6a-4b0d88bfc7cf',
        method: 'DELETE',
        status: 200,
        response: {},
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/44ac3882-1d32-415e-a3bb-fa375c576855',
        method: 'DELETE',
        status: 200,
        response: {},
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/b8784fb4-1b33-433f-aa6d-57e137e9d34f/bank_accounts/b5b5c1b4-4ced-4cd3-9c34-87e7aeaa0eb2',
        method: 'PATCH',
        status: 200,
        response: banksAccountsOrganization.data[0],
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/c25fddc6-7558-440e-8810-c9e970e6d3e9/bank_accounts/b5b5c1b4-4ced-4cd3-9c34-87e7aeaa0eb2',
        method: 'DELETE',
        status: 200,
        response: {},
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/72b00f64-b9ed-4c59-ab58-2c19c01a21a7',
        method: 'GET',
        status: 200,
        response: counterpartIndividual,
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/dbe1aa12-6960-4e44-a5b0-f2a931a077c7',
        method: 'PATCH',
        status: 200,
        response: counterpartIndividual,
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/dbe1aa12-6960-4e44-a5b0-f2a931a077c7',
        method: 'DELETE',
        status: 200,
        response: {},
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/72b00f64-b9ed-4c59-ab58-2c19c01a21a7/bank_accounts/b5b5c1b4-4ced-4cd3-9c34-87e7aeaa0eb2',
        method: 'PATCH',
        status: 200,
        response: banksAccountsOrganization.data[0],
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/72b00f64-b9ed-4c59-ab58-2c19c01a21a7/bank_accounts/b5b5c1b4-4ced-4cd3-9c34-87e7aeaa0eb2',
        method: 'DELETE',
        status: 200,
        response: {},
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/44ac3882-1d32-415e-a3bb-fa375c576855/contacts',
        method: 'GET',
        status: 200,
        response: contactsOrganization,
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/44ac3882-1d32-415e-a3bb-fa375c576855/bank_accounts',
        method: 'GET',
        status: 200,
        response: banksAccountsOrganization,
      },
      {
        url: 'https://api.dev.monite.com/v1/counterparts/dbe1aa12-6960-4e44-a5b0-f2a931a077c7/bank_accounts',
        method: 'GET',
        status: 200,
        response: banksAccountsOrganization,
      },
    ],
  },
};

export default Story;

export const OrganizationCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails
      id={'b8784fb4-1b33-433f-aa6d-57e137e9d34f'}
      type={CounterpartType.ORGANIZATION}
    />
  </div>
);

export const IndividualCounterpart = () => (
  <div style={{ maxWidth: 536 }}>
    <CounterpartsDetails
      id={'72b00f64-b9ed-4c59-ab58-2c19c01a21a7'}
      type={CounterpartType.INDIVIDUAL}
    />
  </div>
);
