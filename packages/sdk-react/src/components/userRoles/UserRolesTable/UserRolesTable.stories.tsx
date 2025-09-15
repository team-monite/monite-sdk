import { UserRolesTable as UserRolesTableComponent } from './UserRolesTable';
import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';
import { action } from 'storybook/actions';

const Story = {
  title: 'User Roles/User Roles — Table View',
  component: UserRolesTableComponent,
};

type Story = StoryObj<typeof UserRolesTableComponent>;

export const UserRolesTable: Story = {
  args: {
    onFilterChanged: action('onFilterChanged'),
    onSortChanged: action('onSortChanged'),
  },
  render: (args) => (
    <div
      css={css`
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100vh;
        padding: 20px;
      `}
    >
      <UserRolesTableComponent {...args} />
    </div>
  ),
};

export default Story;
