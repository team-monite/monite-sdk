import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceStatusChip as InvoiceStatusChipComponent } from './InvoiceStatusChip';

const meta: Meta<typeof InvoiceStatusChipComponent> = {
  title: 'Components / InvoiceStatusChip',
  component: InvoiceStatusChipComponent,
};

type Story = StoryObj<typeof InvoiceStatusChipComponent>;

export const InvoiceStatusChip: Story = {
  args: {
    status: 'paid',
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
      <InvoiceStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
