import { Meta, StoryObj } from '@storybook/react';

import { TagsTable } from './TagsTable';

const meta: Meta<typeof TagsTable> = {
  title: 'Tags/Tags — Table View',
  component: TagsTable,
};

type Story = StoryObj<typeof TagsTable>;

export const FullPermissions: Story = {
  render: (args) => (
    <div style={{ height: 600, padding: 20 }}>
      <TagsTable {...args} />
    </div>
  ),
};
export default meta;
