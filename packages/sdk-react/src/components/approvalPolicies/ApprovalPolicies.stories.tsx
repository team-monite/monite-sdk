import { StoryObj } from '@storybook/react';

import { ApprovalPolicies as ApprovalPoliciesComponent } from './ApprovalPolicies';

const Story = {
  title: 'Approval Policies',
  component: ApprovalPoliciesComponent,
};

type Story = StoryObj<typeof ApprovalPoliciesComponent>;

export const ApprovalPolicies: Story = {
  args: {},
  render: () => <ApprovalPoliciesComponent />,
};

export default Story;
