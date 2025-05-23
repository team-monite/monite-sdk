import { withGlobalStorybookDecorator } from '@/utils/storybook-utils';
import type { Meta, StoryObj } from '@storybook/react';

import { ConfirmationModal } from './ConfirmationModal';

const meta: Meta<typeof ConfirmationModal> = {
  title: 'Components/ConfirmationModal',
  component: ConfirmationModal,
  decorators: [withGlobalStorybookDecorator()],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmationModal>;

export const Default: Story = {
  args: {
    open: true,
    title: 'Confirm Action',
    message: 'Are you sure you want to proceed with this action?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Action confirmed'),
  },
  render: (args) => <ConfirmationModal {...args} />,
};

export const Closed: Story = {
  args: {
    ...Default.args,
    open: false,
  },
  render: (args) => <ConfirmationModal {...args} />,
};

export const Loading: Story = {
  args: {
    ...Default.args,
    isLoading: true,
  },
  render: (args) => <ConfirmationModal {...args} />,
};

export const LongMessage: Story = {
  args: {
    open: true,
    title: 'Important Notice',
    message:
      'This is a very long message that demonstrates how the dialog handles content that might span multiple lines. The dialog should properly wrap and display this text while maintaining its layout and spacing.',
    confirmLabel: 'I Understand',
    cancelLabel: 'Go Back',
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Action confirmed'),
  },
  render: (args) => <ConfirmationModal {...args} />,
};

export const WithChildren: Story = {
  args: {
    open: true,
    title: 'Custom Content',
    confirmLabel: 'Proceed',
    cancelLabel: 'Cancel',
    onClose: () => console.log('Dialog closed'),
    onConfirm: () => console.log('Action confirmed'),
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p>
          This dialog demonstrates custom content using children instead of a
          message.
        </p>
        <div
          style={{
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: 0 }}>
            You can include any React components here.
          </p>
        </div>
      </div>
    ),
  },
  render: (args) => <ConfirmationModal {...args} />,
};
