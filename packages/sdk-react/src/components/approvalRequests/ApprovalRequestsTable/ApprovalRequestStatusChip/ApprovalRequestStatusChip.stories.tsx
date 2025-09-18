import { ApprovalRequestStatusChip as ApprovalRequestStatusChipComponent } from './ApprovalRequestStatusChip';
import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof ApprovalRequestStatusChipComponent> = {
  title: 'Components / ApprovalRequestStatusChip',
  component: ApprovalRequestStatusChipComponent,
};

type Story = StoryObj<typeof ApprovalRequestStatusChipComponent>;

export const ApprovalRequestStatusChip: Story = {
  args: {
    status: 'approved',
  },
  decorators: withGlobalStorybookDecorator(() => ({
    theme: {
      components: {
        approvalRequestStatusChip: {
          icon: true,
          size: 'medium',
          variant: 'outlined',
        },
      },
    },
  })),
  render: (args) => (
    <div style={{ height: 500, padding: 20 }}>
      <ApprovalRequestStatusChipComponent {...args} />
    </div>
  ),
};

export default meta;
