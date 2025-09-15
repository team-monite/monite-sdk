import { IconWrapper } from './IconWrapper';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { action } from 'storybook/actions';

const meta: Meta<typeof IconWrapper> = {
  title: 'components/IconWrapper',
  component: IconWrapper,
  argTypes: {
    tooltip: {
      control: 'text',
      description: 'Tooltip text that displays on hover',
    },
    color: {
      control: 'select',
      options: [
        'inherit',
        'default',
        'primary',
        'secondary',
        'error',
        'info',
        'success',
        'warning',
      ],
      description: 'Sets the icon color as per MUI theme colors',
      defaultValue: 'default',
    },
    isDynamic: {
      control: 'boolean',
      description: 'If true, icon toggles between Close and Arrow on hover',
      defaultValue: false,
    },
    onClick: { action: 'clicked' },
  },
};

type Story = StoryObj<typeof IconWrapper>;

export const Default: Story = {
  args: {
    tooltip: 'Close the dialog',
  },
  render: (args) => <IconWrapper {...args} onClick={action('onClick')} />,
};

export const ArrowIcon: Story = {
  args: {
    tooltip: 'Go back',
  },
  render: (args) => <IconWrapper {...args} onClick={action('onClick')} />,
};

export const WithTooltip: Story = {
  args: {
    tooltip: 'Custom Tooltip Example',
    color: 'primary',
  },
  render: (args) => <IconWrapper {...args} onClick={action('onClick')} />,
};

export const DynamicIcon: Story = {
  args: {
    isDynamic: true,
    tooltip: 'Hover to swap icon',
  },
  render: (args) => <IconWrapper {...args} onClick={action('onClick')} />,
  parameters: {
    docs: {
      description: {
        story:
          'This version of IconWrapper changes icon on hover based on `isDynamic` prop.',
      },
    },
  },
};

const ToggleableIconWrapper = () => {
  const [showCloseIcon, setShowCloseIcon] = useState(true);

  return (
    <>
      <IconWrapper onClick={action('onClick')} tooltip="Toggleable Icon">
        <CloseIcon />
      </IconWrapper>
      <Button onClick={() => setShowCloseIcon(!showCloseIcon)}>
        Toggle Icon
      </Button>
    </>
  );
};

export const ToggleIconStory: Story = {
  render: () => <ToggleableIconWrapper />,
  parameters: {
    docs: {
      description: {
        story:
          'An example of IconWrapper that toggles between close and arrow icons via an external button.',
      },
    },
  },
};

export default meta;
