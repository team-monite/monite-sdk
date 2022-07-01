import { ComponentStory } from '@storybook/react';

import IconButton from './IconButton';

import { InfoIcon, MailIcon } from '../Icons';
import { Flex } from '../Box';

const Story = {
  title: 'Components/IconButton',
  component: IconButton,
};

export default Story;

const Template: ComponentStory<typeof IconButton> = ({ children, ...args }) => (
  <IconButton {...args}>{children}</IconButton>
);

export const DefaultIconButton = Template.bind({});
DefaultIconButton.args = {
  children: <InfoIcon />,
};

export const Primary = () => {
  return (
    <Flex style={{ gap: 20 }}>
      <IconButton variant={'contained'}>
        <InfoIcon width={24} height={24} />
      </IconButton>
      <IconButton isLoading variant={'contained'}>
        <InfoIcon width={24} height={24} />
      </IconButton>
      <IconButton>
        <MailIcon />
      </IconButton>
    </Flex>
  );
};
