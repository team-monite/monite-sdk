import { PayableDetailsForm } from './PayableDetailsForm';
import { Dialog } from '@/ui/Dialog';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

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
        ocr_set_quantity_to_one: false,
      },
    ],
    ...actions,
  },
  decorators: withGlobalStorybookDecorator(() => ({
    componentSettings: {
      payables: {
        optionalFields: {
          invoiceDate: false, // Show the invoice date field
          tags: false, // Show the tags field
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
  })),
  render: (args) => {
    return (
      <Dialog alignDialog="right" open={true} onClose={action('onClose')}>
        <PayableDetailsForm {...args} />
      </Dialog>
    );
  },
};

export default meta;
