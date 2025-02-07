import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { ApprovalStatusChip as ApprovalStatusChipComponent } from './ApprovalStatusChip';

const meta: Meta<typeof ApprovalStatusChipComponent> = {
  title: 'Components / ApprovalStatusChip',
  component: ApprovalStatusChipComponent,
};

type Story = StoryObj<typeof ApprovalStatusChipComponent>;

export const ApprovalStatusChip: Story = {
  args: {
    status: 'active',
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        approvalStatusChip: {
          icon: true,
          size: 'medium',
          variant: 'outlined',
        },
      },
    },
  })),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ApprovalStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
