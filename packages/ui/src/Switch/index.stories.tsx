import React from 'react';
import { ComponentStory } from '@storybook/react';

import Switch from '.';

const Story = {
  title: 'Components/Switch',
  component: Switch,
};
export default Story;

const Template: ComponentStory<typeof Switch> = (args) => (
  <>
    <Switch {...args} />
    <Switch {...args} checked label="Checked Default Switch" />
  </>
);

export const DefaultSwitch = Template.bind({});
DefaultSwitch.args = {
  label: 'Default Switch',
};

export const States = () => {
  return (
    <>
      <Switch id="5" name="5" value="5" isDisabled label="Disable" />
      <Switch
        id="6"
        name="6"
        value="6"
        isDisabled
        checked
        label="Disable Checked"
      />
      <br />
    </>
  );
};
