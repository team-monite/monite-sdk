import { ComponentStory } from '@storybook/react';

import IconButton from './IconButton';

import { UInfoCircle, UEnvelopeAlt } from '../unicons';
import { Flex } from '../Box';

const Story = {
  title: 'Data Input/IconButton',
  component: IconButton,
};

export default Story;

const Template: ComponentStory<typeof IconButton> = ({ children, ...args }) => (
  <IconButton {...args}>{children}</IconButton>
);

export const DefaultIconButton = Template.bind({});
DefaultIconButton.args = {
  children: <UInfoCircle />,
};

export const Primary = () => {
  return (
    <Flex style={{ gap: 20 }}>
      <IconButton variant={'contained'}>
        <UInfoCircle />
      </IconButton>
      <IconButton isLoading variant={'contained'}>
        <UInfoCircle />
      </IconButton>
      <IconButton>
        <UEnvelopeAlt />
      </IconButton>
    </Flex>
  );
};
