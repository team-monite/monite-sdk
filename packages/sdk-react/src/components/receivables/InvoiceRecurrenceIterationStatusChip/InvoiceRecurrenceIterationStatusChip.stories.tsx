import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceRecurrenceIterationStatusChip as InvoiceRecurrenceIterationStatusChipComponent } from './InvoiceRecurrenceIterationStatusChip';

const meta: Meta<typeof InvoiceRecurrenceIterationStatusChipComponent> = {
  title: 'Components / InvoiceRecurrenceIterationStatusChip',
  component: InvoiceRecurrenceIterationStatusChipComponent,
};

type Story = StoryObj<typeof InvoiceRecurrenceIterationStatusChipComponent>;

export const InvoiceRecurrenceIterationStatusChip: Story = {
  args: {
    status: 'pending',
    icon: true,
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        invoiceRecurrenceIterationStatusChip: {
          icon: true,
          size: 'medium',
          variant: 'outlined',
        },
      },
    },
  })),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceRecurrenceIterationStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
