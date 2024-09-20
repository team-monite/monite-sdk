import { Dialog } from '@/components/Dialog';
import { ExtendThemeProvider } from '@/utils/ExtendThemeProvider';
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
      <Dialog alignDialog="right" open={true} onClose={action('onClose')}>
        <ExtendThemeProvider
          theme={{
            components: {
              MonitePayableDetailsInfo: {
                defaultProps: {
                  optionalFields: {
                    invoiceDate: true, // Show the invoice date field
                    tags: true, // Show the tags field
                  },
                  ocrRequiredFields: {
                    invoiceNumber: true, // The invoice number is required based on OCR data
                    counterpart: true, // The counterpart is required based on OCR data
                    dueDate: true, // The due date is required based on OCR data
                    currency: true, // The currency is required based on OCR data
                  },
                  ocrMismatchFields: {
                    amount_to_pay: true,
                    counterpart_bank_account_id: true,
                  },
                },
              },
            },
          }}
        >
          <PayableDetailsForm {...args} />
        </ExtendThemeProvider>
      </Dialog>
    );
  },
};

export default meta;
