import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceRecurrenceStatusChip as InvoiceRecurrenceStatusChipComponent } from './InvoiceRecurrenceStatusChip';

const meta: Meta<typeof InvoiceRecurrenceStatusChipComponent> = {
  title: 'Components / InvoiceRecurrenceStatusChip',
  component: InvoiceRecurrenceStatusChipComponent,
};

type Story = StoryObj<typeof InvoiceRecurrenceStatusChipComponent>;

export const InvoiceRecurrenceStatusChip: Story = {
  args: {
    status: 'active',
    icon: true,
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        invoiceRecurrenceStatusChip: {
          icon: true,
          size: 'medium',
          variant: 'outlined',
        },
      },
    },
  })),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceRecurrenceStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
