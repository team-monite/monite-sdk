import { css } from '@emotion/react';
import { StoryObj } from '@storybook/react';

import { ApprovalPolicies as ApprovalPoliciesComponent } from './ApprovalPolicies';

const Story = {
  title: 'Approval Policies',
  component: ApprovalPoliciesComponent,
};

type Story = StoryObj<typeof ApprovalPoliciesComponent>;

export const ApprovalPolicies: Story = {
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
      <ApprovalPoliciesComponent />
    </div>
  ),
};

export default Story;
