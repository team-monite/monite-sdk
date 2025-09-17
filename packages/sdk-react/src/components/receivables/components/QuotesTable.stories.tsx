import { QuotesTable } from './QuotesTable';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';

const meta: Meta<typeof QuotesTable> = {
  title: 'Receivables/Quotes — Table View',
  component: QuotesTable,
};

type Story = StoryObj<typeof QuotesTable>;

export const FullPermissions: Story = {
  args: {
    onRowClick: action('onRowClick'),
    onChangeSort: action('onChangeSort'),
  },
  render: (args) => (
    <div style={{ padding: 20 }}>
      <QuotesTable {...args} />
    </div>
  ),
};

export default meta;
