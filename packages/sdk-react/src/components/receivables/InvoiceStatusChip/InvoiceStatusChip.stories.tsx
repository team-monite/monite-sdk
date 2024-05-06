import { ReceivablesStatusEnum } from '@monite/sdk-api';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceStatusChip } from './InvoiceStatusChip';

const meta: Meta<typeof InvoiceStatusChip> = {
  title: 'Receivables / InvoiceStatusChip',
  component: InvoiceStatusChip,
};

type Story = StoryObj<typeof InvoiceStatusChip>;

export const Basic: Story = {
  args: {
    status: ReceivablesStatusEnum.PAID,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceStatusChip {...args} />
    </div>
  ),
};

export default meta;
