import type { Meta, StoryObj } from '@storybook/react';

import { ApprovalRequestsTable } from './ApprovalRequestsTable';

const meta: Meta<typeof ApprovalRequestsTable> = {
  title: 'Approval Requests/Approval Requests — Table View',
  component: ApprovalRequestsTable,
};

type Story = StoryObj<typeof ApprovalRequestsTable>;

export const Default: Story = {
  render: () => <ApprovalRequestsTable />,
};

export default meta;
