import { TagsTable } from './TagsTable';
import { Meta, StoryObj } from '@storybook/react-vite';

const meta: Meta<typeof TagsTable> = {
  title: 'Tags/Tags — Table View',
  component: TagsTable,
};

type Story = StoryObj<typeof TagsTable>;

export const FullPermissions: Story = {
  render: (args) => (
    <div style={{ padding: 20 }}>
      <TagsTable {...args} />
    </div>
  ),
};
export default meta;
