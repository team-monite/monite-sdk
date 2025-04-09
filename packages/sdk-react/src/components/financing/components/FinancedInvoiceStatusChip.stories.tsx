import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { FinancedInvoiceStatusChip as FinancedInvoiceStatusChipComponent } from './FinancedInvoiceStatusChip';

const meta: Meta<typeof FinancedInvoiceStatusChipComponent> = {
  title: 'Components / FinancedInvoiceStatusChip',
  component: FinancedInvoiceStatusChipComponent,
};

type Story = StoryObj<typeof FinancedInvoiceStatusChipComponent>;

export const FinancedInvoiceStatusChip: Story = {
  args: {
    status: 'PAID',
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        invoiceStatusChip: {
          icon: true,
          size: 'medium',
          variant: 'outlined',
        },
      },
    },
  })),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <FinancedInvoiceStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
