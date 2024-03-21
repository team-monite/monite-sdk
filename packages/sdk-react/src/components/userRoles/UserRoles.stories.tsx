import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { UserRoles as UserRolesComponent } from './UserRoles';

const Story = {
  title: 'User Roles',
  component: UserRolesComponent,
};

type Story = StoryObj<typeof UserRolesComponent>;

export const UserRoles: Story = {
  args: {},
  render: () => (
    <div
      css={css`
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 20px;
      `}
    >
      <UserRolesComponent />
    </div>
  ),
};

export default Story;
