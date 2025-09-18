import { CreditNotesTable } from './CreditNotesTable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

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
    <div style={{ padding: 20 }}>
      <CreditNotesTable {...args} />
    </div>
  ),
};

export default meta;
