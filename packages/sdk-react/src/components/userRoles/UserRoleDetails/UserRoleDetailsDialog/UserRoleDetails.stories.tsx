import { Dialog } from '@/components/Dialog';
import { FULL_PERMISSION_ROLE_ID } from '@/mocks/roles/rolesFixtures';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { UserRoleDetailsDialog } from './UserRoleDetailsDialog';

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
