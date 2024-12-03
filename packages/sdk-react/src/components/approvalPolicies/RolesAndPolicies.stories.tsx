import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { RolesAndApprovalPolicies as RolesAndPoliciesComponent } from './RolesAndPolicies';

const Story = {
  title: 'Approval Policies / Roles and Approvals',
  component: RolesAndPoliciesComponent,
};

type Story = StoryObj<typeof RolesAndPoliciesComponent>;

export const RolesAndApprovals: Story = {
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
      <RolesAndPoliciesComponent />
    </div>
  ),
};

export default Story;
