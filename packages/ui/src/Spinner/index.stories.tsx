import { ComponentStory } from '@storybook/react';

import Spinner from '.';

const Story = {
  title: 'Data Display/Spinner',
  component: Spinner,
};
export default Story;

const Template: ComponentStory<typeof Spinner> = (args) => (
  <Spinner {...args} />
);

export const DefaultSpinner = Template.bind({});

export const Sizes = () => {
  return (
    <>
      <Spinner pxSize={40} />
      <br />
      <Spinner pxSize={20} />
      <br />
      <Spinner pxSize={10} />
    </>
  );
};
