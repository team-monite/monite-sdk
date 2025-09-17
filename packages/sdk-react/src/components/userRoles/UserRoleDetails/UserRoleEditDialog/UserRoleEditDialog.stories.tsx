import { UserRoleEditDialog } from './UserRoleEditDialog';
import { FULL_PERMISSION_ROLE_ID } from '@/mocks/roles/rolesFixtures';
import { Dialog } from '@/ui/Dialog';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

const meta: Meta<typeof UserRoleEditDialog> = {
  title: 'User Roles/User Roles — Edit View',
  component: UserRoleEditDialog,
};

type Story = StoryObj<typeof UserRoleEditDialog>;

export const DialogEditView: Story = {
  args: {
    id: FULL_PERMISSION_ROLE_ID,
  },
  render: (args) => (
    <Dialog open={true} fullScreen onClose={action('onClose')}>
      <UserRoleEditDialog {...args} />
    </Dialog>
  ),
};

export default meta;
