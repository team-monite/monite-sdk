import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoiceRecurrenceIterationStatusChip as InvoiceRecurrenceIterationStatusChipComponent } from './InvoiceRecurrenceIterationStatusChip';

const meta: Meta<typeof InvoiceRecurrenceIterationStatusChipComponent> = {
  title: 'Components / InvoiceRecurrenceIterationStatusChip',
  component: InvoiceRecurrenceIterationStatusChipComponent,
  parameters: {
    docs: {
      description: {
        component: 'A chip component that displays the status of a recurring iteration invoice.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: [
        'pending',
        'skipped',
        'canceled',
        'issue_failed',
        'send_failed',
        'completed',
      ],
      description: 'The status of the recurring iteration invoice',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

type Story = StoryObj<typeof InvoiceRecurrenceIterationStatusChipComponent>;

export const Default: Story = {
  args: {
    status: 'pending',
  },
  decorators: withGlobalStorybookDecorator(),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceRecurrenceIterationStatusChipComponent {...args} />
    </div>
  ),
};

export const AllStatuses: Story = {
  decorators: withGlobalStorybookDecorator(),
  render: () => (
    <div style={{ height: 500, padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <InvoiceRecurrenceIterationStatusChipComponent status="pending" />
        <InvoiceRecurrenceIterationStatusChipComponent status="skipped" />
        <InvoiceRecurrenceIterationStatusChipComponent status="canceled" />
        <InvoiceRecurrenceIterationStatusChipComponent status="issue_failed" />
        <InvoiceRecurrenceIterationStatusChipComponent status="send_failed" />
        <InvoiceRecurrenceIterationStatusChipComponent status="completed" />
      </div>
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    status: 'pending',
    className: 'mtw:px-4 mtw:py-2 mtw:text-lg',
  },
  decorators: withGlobalStorybookDecorator(),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceRecurrenceIterationStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
