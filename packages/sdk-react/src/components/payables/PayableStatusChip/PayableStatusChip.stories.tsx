import { PayableStateEnum } from '@monite/sdk-api';
import type { Meta, StoryObj } from '@storybook/react';

import { PayableStatusChip } from './PayableStatusChip';

const meta: Meta<typeof PayableStatusChip> = {
  title: 'Payables / PayableStatusChip',
  component: PayableStatusChip,
};

type Story = StoryObj<typeof PayableStatusChip>;

export const Basic: Story = {
  args: {
    status: PayableStateEnum.PAID,
  },
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <PayableStatusChip {...args} />
    </div>
  ),
};

export default meta;
