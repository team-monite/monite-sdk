import React, { useState } from 'react';

import { Dialog } from '@/components/Dialog';
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

const payableId = '9a3b97a5-a1ba-4d8c-bade-ad3c47ae61e0';

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

export const DialogDetailsForm: Story = {
  args: {
    payableDetailsFormId: 'payable-form-2',
    lineItems: [
      {
        payable_id: payableId,
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

export default meta;
