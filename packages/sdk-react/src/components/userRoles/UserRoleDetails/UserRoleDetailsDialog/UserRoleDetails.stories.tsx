import { UserRoleDetailsDialog } from './UserRoleDetailsDialog';
import { FULL_PERMISSION_ROLE_ID } from '@/mocks/roles/rolesFixtures';
import { Dialog } from '@/ui/Dialog';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

const meta: Meta<typeof UserRoleDetailsDialog> = {
  title: 'User Roles/User Roles — Details View',
  component: UserRoleDetailsDialog,
};

type Story = StoryObj<typeof UserRoleDetailsDialog>;

export const DialogDetailsView: Story = {
  args: {
    id: FULL_PERMISSION_ROLE_ID,
  },
  render: (args) => (
    <Dialog open={true} alignDialog="right" onClose={action('onClose')}>
      <UserRoleDetailsDialog {...args} />
    </Dialog>
  ),
};

export default meta;
