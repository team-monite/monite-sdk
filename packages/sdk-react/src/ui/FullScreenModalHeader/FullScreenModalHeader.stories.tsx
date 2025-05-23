import { Button, Chip } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';

import { Dialog } from '../../components/Dialog/Dialog';
import { FullScreenModalHeader } from './FullScreenModalHeader';

const meta: Meta<typeof FullScreenModalHeader> = {
  title: 'Components/FullScreenModalHeader',
  component: FullScreenModalHeader,
  decorators: [
    (Story) => (
      <Dialog open={true} fullScreen={true} onClose={action('onClose')}>
        <Story />
      </Dialog>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A full-screen modal header component that displays a title, optional status element, and action buttons. It includes a close button when used within a Dialog component.',
      },
    },
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'The title of the dialog',
    },
    statusElement: {
      control: 'object',
      description:
        'Optional status chip or other element to display next to the title',
    },
    actions: {
      control: 'object',
      description:
        'Optional actions to display on the right side of the header',
    },
    closeButtonTooltip: {
      control: 'text',
      description: 'Optional close button tooltip',
    },
    className: {
      control: 'text',
      description: 'Optional class name for styling',
    },
  },
};

type Story = StoryObj<typeof FullScreenModalHeader>;

export const Basic: Story = {
  args: {
    title: 'Basic Header',
  },
};

export const WithStatus: Story = {
  args: {
    title: 'Header with Status',
    statusElement: <Chip label="Active" color="success" />,
  },
};

export const WithActions: Story = {
  args: {
    title: 'Header with Actions',
    actions: (
      <>
        <Button onClick={action('action1')}>Action 1</Button>
        <Button onClick={action('action2')}>Action 2</Button>
      </>
    ),
  },
};

export const Complete: Story = {
  args: {
    title: 'Complete Header',
    statusElement: <Chip label="Draft" color="warning" />,
    actions: (
      <>
        <Button onClick={action('save')}>Save</Button>
        <Button onClick={action('publish')}>Publish</Button>
      </>
    ),
    closeButtonTooltip: 'Close this dialog',
  },
};

export default meta;
