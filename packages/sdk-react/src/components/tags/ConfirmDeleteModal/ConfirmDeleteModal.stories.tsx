import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';

import { ConfirmDeleteModal } from './ConfirmDeleteModal';

const meta: Meta<typeof ConfirmDeleteModal> = {
  title: 'Tags/Tags — Confirm Delete Modal',
  component: ConfirmDeleteModal,
};

type Story = StoryObj<typeof ConfirmDeleteModal>;

export const Default: Story = {
  args: {
    modalOpened: true,
    tag: {
      id: 'tag-1',
      name: 'Counterpart tag name ',
    },
    onClose: action('onClose'),
  },
  render: (args) => <ConfirmDeleteModal {...args} />,
};

export const WithError: Story = {
  args: {
    modalOpened: true,
    tag: {
      id: '0',
      name: 'Tag with error',
    },
    onClose: action('onClose'),
  },
  render: (args) => <ConfirmDeleteModal {...args} />,
};

export default meta;
