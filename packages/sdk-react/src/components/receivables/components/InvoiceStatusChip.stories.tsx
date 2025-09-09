import { InvoiceStatusChip as InvoiceStatusChipComponent } from './InvoiceStatusChip';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof InvoiceStatusChipComponent> = {
  title: 'Components / InvoiceStatusChip',
  component: InvoiceStatusChipComponent,
  parameters: {
    docs: {
      description: {
        component: 'A chip component that displays the status of an invoice.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: [
        'draft',
        'issuing',
        'issued',
        'failed',
        'accepted',
        'partially_paid',
        'paid',
        'expired',
        'uncollectible',
        'canceled',
        'recurring',
        'declined',
        'overdue',
        'deleted',
      ],
      description: 'The status of the invoice',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

type Story = StoryObj<typeof InvoiceStatusChipComponent>;

export const Default: Story = {
  args: {
    status: 'paid',
  },
  decorators: withGlobalStorybookDecorator(),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceStatusChipComponent {...args} />
    </div>
  ),
};

export const AllStatuses: Story = {
  decorators: withGlobalStorybookDecorator(),
  render: () => (
    <div style={{ height: 500, padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <InvoiceStatusChipComponent status="draft" />
        <InvoiceStatusChipComponent status="issuing" />
        <InvoiceStatusChipComponent status="issued" />
        <InvoiceStatusChipComponent status="failed" />
        <InvoiceStatusChipComponent status="accepted" />
        <InvoiceStatusChipComponent status="partially_paid" />
        <InvoiceStatusChipComponent status="paid" />
        <InvoiceStatusChipComponent status="expired" />
        <InvoiceStatusChipComponent status="uncollectible" />
        <InvoiceStatusChipComponent status="canceled" />
        <InvoiceStatusChipComponent status="recurring" />
        <InvoiceStatusChipComponent status="declined" />
        <InvoiceStatusChipComponent status="overdue" />
        <InvoiceStatusChipComponent status="deleted" />
      </div>
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    status: 'paid',
    className: 'mtw:px-4 mtw:py-2 mtw:text-lg',
  },
  decorators: withGlobalStorybookDecorator(),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
