import { Dialog } from '@/components/Dialog';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { PayableDetailsForm } from './PayableDetailsForm';

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
  render: (args) => {
    return (
      <Dialog
        open={true}
        fullScreen
        onClose={() => {
          action('onClose')();
        }}
        onSubmit={() => {}}
        onClosed={action('onClosed')}
      >
        <PayableDetailsForm {...args} />
      </Dialog>
    );
  },
};

export default meta;
