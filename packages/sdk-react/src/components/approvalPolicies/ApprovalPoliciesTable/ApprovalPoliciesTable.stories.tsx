import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { ApprovalPoliciesTable } from './ApprovalPoliciesTable';

const meta: Meta<typeof ApprovalPoliciesTable> = {
  title: 'Approval Policies/Approval Policies — Table View',
  component: ApprovalPoliciesTable,
};

type Story = StoryObj<typeof ApprovalPoliciesTable>;

export const Default: Story = {
  args: {
    onChangeFilter: action('onChangeFilter'),
    onChangeSort: action('onChangeSort'),
  },
  render: (args) => <ApprovalPoliciesTable {...args} />,
};

export default meta;
