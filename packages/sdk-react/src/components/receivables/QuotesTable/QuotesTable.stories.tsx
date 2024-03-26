import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { QuotesTable } from './QuotesTable';

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
    <div style={{ height: 500 }}>
      <QuotesTable {...args} />
    </div>
  ),
};

export default meta;
