import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';

import { TagFormModal } from './TagFormModal';

const meta: Meta<typeof TagFormModal> = {
  title: 'Tags/Tags — Create, Update Tag Modal',
  component: TagFormModal,
};

type Story = StoryObj<typeof TagFormModal>;

export const CreateTag: Story = {
  args: {
    open: true,
    onCreate: action('onCreate'),
    onClose: action('onClose'),
  },
  render: (args) => <TagFormModal {...args} />,
};

export const UpdateTag: Story = {
  args: {
    open: true,
    onCreate: action('onCreate'),
    onUpdate: action('onUpdate'),
    onClose: action('onClose'),
    tag: {
      id: 'tag-1',
      name: 'Existing tag',
    },
  },
  render: (args) => <TagFormModal {...args} />,
};

export default meta;
