import { ApprovalPoliciesTable } from './ApprovalPoliciesTable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

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
  render: (args) => (
    <div style={{ padding: 20 }}>
      <ApprovalPoliciesTable {...args} />
    </div>
  ),
};

export default meta;
