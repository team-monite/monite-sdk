import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { CreditNotesTable } from './CreditNotesTable';

const meta: Meta<typeof CreditNotesTable> = {
  title: 'Receivables/Credit Notes — Table View',
  component: CreditNotesTable,
};

type Story = StoryObj<typeof CreditNotesTable>;

export const FullPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
  },
  render: (args) => (
    <div style={{ height: 500 }}>
      <CreditNotesTable {...args} />
    </div>
  ),
};

export default meta;
