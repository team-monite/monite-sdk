import React, { useState } from 'react';

import { Dialog } from '@/components/Dialog';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import { MoniteSDK } from '@monite/sdk-api';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import {
  PayableDetailsForm,
  PayableDetailsFormProps,
} from './PayableDetailsForm';

const meta: Meta<typeof PayableDetailsForm> = {
  title: 'Payables/Payables — Details Form',
  component: PayableDetailsForm,
};

type Story = StoryObj<typeof PayableDetailsForm>;

const actions = {
  onSavePayable: action('onSavePayable'),
  onCreatePayable: action('onCreatePayable'),
};

const WithDialogComponent: React.FC<PayableDetailsFormProps> = (args) => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog
      open={open}
      fullScreen
      onClose={() => {
        action('onClose')();
        setOpen(false);
      }}
      onSubmit={() => {}}
      onClosed={action('onClosed')}
    >
      <PayableDetailsForm {...args} />
    </Dialog>
  );
};

export const Default: Story = {
  args: {
    payableDetailsFormId: 'payable-form-1',
    optionalFields: { invoiceDate: true, tags: true },
    lineItems: [
      {
        payable_id: 'payable-1',
        id: 'item-1',
        name: 'Service A',
        quantity: 1,
        tax: 10,
      },
    ],
    ...actions,
  },
  render: (args) => <PayableDetailsForm {...args} />,
};

export const WithDialog: Story = {
  args: {
    payableDetailsFormId: 'payable-form-2',
    optionalFields: { invoiceDate: true, tags: true },
    lineItems: [
      {
        payable_id: 'payable-2',
        id: 'item-2',
        name: 'Service B',
        quantity: 2,
        tax: 20,
      },
    ],
    ...actions,
  },
  render: (args) => <WithDialogComponent {...args} />,
};

export const FullPermissions: Story = {
  args: {
    payableDetailsFormId: 'payable-form-3',
    optionalFields: { invoiceDate: true, tags: true },
    lineItems: [
      {
        payable_id: 'payable-3',
        id: 'item-3',
        name: 'Service C',
        quantity: 3,
        tax: 30,
      },
    ],
    ...actions,
  },
  render: (args) => <PayableDetailsForm {...args} />,
};

export const LowPermissions: Story = {
  args: {
    payableDetailsFormId: 'payable-form-4',
    optionalFields: { invoiceDate: false, tags: false },
    lineItems: [
      {
        payable_id: 'payable-4',
        id: 'item-4',
        name: 'Service D',
        quantity: 4,
        tax: 40,
      },
    ],
    ...actions,
  },
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: 'access_token_value',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: 'low-permissions-entity',
      });

      return { monite };
    }),
  ],
  render: (args) => <PayableDetailsForm {...args} />,
};

export const EmptyPermissions: Story = {
  args: {
    payableDetailsFormId: 'payable-form-5',
    optionalFields: { invoiceDate: true, tags: true },
    lineItems: [
      {
        payable_id: 'payable-5',
        id: 'item-5',
        name: 'Service E',
        quantity: 5,
        tax: 50,
      },
    ],
    ...actions,
  },
  decorators: [
    withGlobalStorybookDecorator(() => {
      const monite = new MoniteSDK({
        fetchToken: () =>
          Promise.resolve({
            access_token: 'access_token_value',
            token_type: 'Bearer',
            expires_in: 3600,
          }),
        entityId: 'empty-permissions-entity',
      });

      return { monite };
    }),
  ],
  render: (args) => <PayableDetailsForm {...args} />,
};

export default meta;
