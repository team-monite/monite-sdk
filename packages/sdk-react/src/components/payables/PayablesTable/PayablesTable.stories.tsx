import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { Typography } from '@mui/material';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { ENTITY_ID_FOR_EMPTY_PERMISSIONS } from '../../../mocks';
import { addNewItemToPayablesList } from '../../../mocks';
import { PayablesTable } from './PayablesTable';

const meta: Meta<typeof PayablesTable> = {
  title: 'Payables/Payables — Table View',
  component: PayablesTable,
};

type Story = StoryObj<typeof PayablesTable>;

export const FullPermissions: Story = {
  args: {
    onPay: action('onPay'),
    onRowClick: action('onRowClick'),
    onChangeFilter: action('onChangeFilter'),
    onChangeSort: action('onChangeSort'),
  },
  render: (args) => (
    <div style={{ height: 600, padding: 20 }}>
      <PayablesTable {...args} />
    </div>
  ),
};

export const AutoUpdatedTable: Story = {
  args: {
    onPay: action('onPay'),
    onRowClick: (...args) => {
      addNewItemToPayablesList();
      action('onRowClick')(...args);
    },
    onChangeFilter: action('onChangeFilter'),
    onChangeSort: action('onChangeSort'),
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        height: 700,
        flexDirection: 'column',
        padding: 20,
      }}
    >
      <>
        <Typography
          sx={{
            margin: '20px',
          }}
        >
          When click on row new item will be added to "database" and after
          some-time new data will appear
        </Typography>
        <PayablesTable {...args} />
      </>
    </div>
  ),
};

export const WithLowPermissions: Story = {
  args: {
    onPay: action('onPay'),
    onRowClick: action('onRowClick'),
    onChangeFilter: action('onChangeFilter'),
    onChangeSort: action('onChangeSort'),
  },
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: 'ueaohsueahtsueahs',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: ENTITY_ID_FOR_EMPTY_PERMISSIONS,
      });

      return { monite };
    }),
  ],
  render: (args) => {
    return (
      <div
        style={{
          display: 'flex',
          height: 500,
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <PayablesTable {...args} />
      </div>
    );
  },
};

export default meta;
