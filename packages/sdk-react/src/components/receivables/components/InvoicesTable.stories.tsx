import { InvoicesTable } from './InvoicesTable';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

const meta: Meta<typeof InvoicesTable> = {
  title: 'Receivables/Invoices — Table View',
  component: InvoicesTable,
};

type Story = StoryObj<typeof InvoicesTable>;

export const FullPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
  },
  render: (args) => (
    <div style={{ padding: 20 }}>
      <InvoicesTable {...args} />
    </div>
  ),
};

export const WithCustomActions: Story = {
  args: {
    onRowClick: action('onRowClick'),
    onRowActionClick: action('onRowActionClick'),
  },
  render: (args) => (
    <div style={{ padding: 20 }}>
      <InvoicesTable
        {...args}
        rowActions={{
          draft: ['edit', 'delete'], // remove 'view' from default
          issued: [
            'view',
            'send',
            'cancel',
            'pay',
            'partiallyPay', // 'copyPaymentLink', 'partiallyPay', 'overduePayment' are not default
            'copyPaymentLink',
            'overduePayment',
          ],
        }}
      />
    </div>
  ),
};

export default meta;
