import { Dialog } from '@/components/Dialog';
import { FULL_PERMISSION_ROLE_ID } from '@/mocks/roles/rolesFixtures';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { UserRoleDetails } from './UserRoleDetails';

const meta: Meta<typeof UserRoleDetails> = {
  title: 'User Roles/User Roles — Details View',
  component: UserRoleDetails,
};

type Story = StoryObj<typeof UserRoleDetails>;

export const DialogDetailsView: Story = {
  args: {
    id: FULL_PERMISSION_ROLE_ID,
  },
  render: (args) => (
    <Dialog open={true} alignDialog="right" onClose={action('onClose')}>
      <UserRoleDetails {...args} />
    </Dialog>
  ),
};

export default meta;
