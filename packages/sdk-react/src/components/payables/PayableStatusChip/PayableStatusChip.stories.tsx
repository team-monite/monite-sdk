import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { PayableStatusChip as PayableStatusChipComponent } from './PayableStatusChip';

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

export default meta;
