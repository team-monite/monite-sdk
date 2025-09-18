import { InvoiceRecurrenceStatusChip as InvoiceRecurrenceStatusChipComponent } from './InvoiceRecurrenceStatusChip';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof InvoiceRecurrenceStatusChipComponent> = {
  title: 'Components / InvoiceRecurrenceStatusChip',
  component: InvoiceRecurrenceStatusChipComponent,
  parameters: {
    docs: {
      description: {
        component:
          'A chip component that displays the status of a recurring invoice.',
      },
    },
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['active', 'paused', 'completed', 'canceled'],
      description: 'The status of the recurring invoice',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply',
    },
  },
};

type Story = StoryObj<typeof InvoiceRecurrenceStatusChipComponent>;

export const Default: Story = {
  args: {
    status: 'active',
  },
  decorators: withGlobalStorybookDecorator(),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceRecurrenceStatusChipComponent {...args} />
    </div>
  ),
};

export const AllStatuses: Story = {
  decorators: withGlobalStorybookDecorator(),
  render: () => (
    <div style={{ height: 500, padding: 20 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <InvoiceRecurrenceStatusChipComponent status="active" />
        <InvoiceRecurrenceStatusChipComponent status="paused" />
        <InvoiceRecurrenceStatusChipComponent status="completed" />
        <InvoiceRecurrenceStatusChipComponent status="canceled" />
      </div>
    </div>
  ),
};

export const WithCustomClassName: Story = {
  args: {
    status: 'active',
    className: 'mtw:px-4 mtw:py-2 mtw:text-lg',
  },
  decorators: withGlobalStorybookDecorator(),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <InvoiceRecurrenceStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
