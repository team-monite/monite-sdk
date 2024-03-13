import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { Permissions as PermissionsComponent } from './Permissions';

const Story = {
  title: 'Permissions',
  component: PermissionsComponent,
};

type Story = StoryObj<typeof PermissionsComponent>;

export const Permissions: Story = {
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
      <PermissionsComponent />
    </div>
  ),
};

export default Story;
