import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { InvoicesTable } from './InvoicesTable';

const meta: Meta<typeof InvoicesTable> = {
  title: 'Receivables/Invoices — Table View',
  component: InvoicesTable,
};

type Story = StoryObj<typeof InvoicesTable>;

export const FullPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
  },
  render: (args) => (
    <div style={{ height: 500 }}>
      <InvoicesTable {...args} />
    </div>
  ),
};

export default meta;
