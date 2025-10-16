import { PayableStatusChip as PayableStatusChipComponent } from './PayableStatusChip';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof PayableStatusChipComponent> = {
  title: 'Components / PayableStatusChip',
  component: PayableStatusChipComponent,
};

type Story = StoryObj<typeof PayableStatusChipComponent>;

export const PayableStatusChip: Story = {
  args: {
    status: 'paid',
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        payableStatusChip: {
          icon: true,
          size: 'medium',
          variant: 'outlined',
        },
      },
    },
  })),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <PayableStatusChipComponent {...args} />
    </div>
  ),
};

export const WithCustomColors: Story = {
  args: {
    status: 'paid',
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        payableStatusChip: {
          icon: true,
          size: 'medium',
          variant: 'filled',
          colors: {
            draft: '#6B7280',
            new: '#3B82F6',
            approve_in_progress: '#F59E0B',
            waiting_to_be_paid: '#8B5CF6',
            partially_paid: '#10B981',
            paid: '#059669',
            rejected: '#EF4444',
            canceled: '#6B7280',
          },
        },
      },
    },
  })),
  render: () => (
    <div
      style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <PayableStatusChipComponent status="draft" />
        <PayableStatusChipComponent status="new" />
        <PayableStatusChipComponent status="approve_in_progress" />
        <PayableStatusChipComponent status="waiting_to_be_paid" />
      </div>
      <div
        style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <PayableStatusChipComponent status="partially_paid" />
        <PayableStatusChipComponent status="paid" />
        <PayableStatusChipComponent status="rejected" />
        <PayableStatusChipComponent status="canceled" />
      </div>
    </div>
  ),
};

export const WithPartialCustomColors: Story = {
  args: {
    status: 'paid',
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        payableStatusChip: {
          icon: false,
          size: 'small',
          variant: 'outlined',
          colors: {
            paid: '#00AA00',
            rejected: '#FF0000',
            // Other statuses will use default colors
          },
        },
      },
    },
  })),
  render: () => (
    <div
      style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      <div>
        <h3 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          Custom colors (paid, rejected)
        </h3>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <PayableStatusChipComponent status="paid" />
          <PayableStatusChipComponent status="rejected" />
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
          Default colors (others)
        </h3>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <PayableStatusChipComponent status="draft" />
          <PayableStatusChipComponent status="new" />
          <PayableStatusChipComponent status="approve_in_progress" />
          <PayableStatusChipComponent status="waiting_to_be_paid" />
          <PayableStatusChipComponent status="partially_paid" />
          <PayableStatusChipComponent status="canceled" />
        </div>
      </div>
    </div>
  ),
};

export default meta;
