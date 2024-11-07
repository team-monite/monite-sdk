import { useState } from 'react';

import { action } from '@storybook/addon-actions';
import { Meta, StoryObj } from '@storybook/react';

import { IconWrapper } from './IconWrapper';

const meta: Meta<typeof IconWrapper> = {
  title: 'components/IconWrapper',
  component: IconWrapper,
  argTypes: {
    showCloseIcon: {
      control: 'boolean',
      description: 'Toggle between Close (X) and Arrow icon',
      defaultValue: true,
    },
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
    showCloseIcon: true,
    tooltip: 'Close the dialog',
  },
  render: (args) => <IconWrapper {...args} onClick={action('onClick')} />,
};

export const ArrowIcon: Story = {
  args: {
    showCloseIcon: false,
    tooltip: 'Go back',
  },
  render: (args) => <IconWrapper {...args} onClick={action('onClick')} />,
};

export const WithTooltip: Story = {
  args: {
    showCloseIcon: true,
    tooltip: 'Custom Tooltip Example',
    color: 'primary',
  },
  render: (args) => <IconWrapper {...args} onClick={action('onClick')} />,
};

export const DynamicIcon: Story = {
  args: {
    showCloseIcon: true,
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
      <IconWrapper
        showCloseIcon={showCloseIcon}
        onClick={action('onClick')}
        tooltip="Toggleable Icon"
      />
      <button onClick={() => setShowCloseIcon(!showCloseIcon)}>
        Toggle Icon
      </button>
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
