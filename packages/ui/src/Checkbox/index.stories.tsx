import React from 'react';
import { ComponentStory } from '@storybook/react';

import Checkbox from '.';

const Story = {
  title: 'Checkbox',
  component: Checkbox,
};
export default Story;

const Template: ComponentStory<typeof Checkbox> = (args) => (
  <Checkbox {...args} />
);

export const DefaultCheckbox = Template.bind({});
DefaultCheckbox.args = {
  label: 'Default Checkbox',
};

export const States = () => {
  return (
    <>
      <Checkbox id="1" name="1" value="1" label="Default" />
      <br />
      <Checkbox id="1" name="1" value="1" label="Disabled" disabled />
      <br />
      <Checkbox id="1" name="1" value="1" label="Invalid" isInvalid />
      <br />
      <Checkbox id="1" name="1" value="1" label="Checked" checked />
      <br />
      <Checkbox
        id="1"
        name="1"
        value="1"
        label="Disabled, Invalid"
        disabled
        isInvalid
      />
      <br />
      <Checkbox
        id="1"
        name="1"
        value="1"
        label="Disabled, Checked"
        disabled
        checked
      />
      <br />
      <Checkbox
        id="1"
        name="1"
        value="1"
        label="Invalid, Checked"
        isInvalid
        checked
      />
      <br />
      <Checkbox
        id="1"
        name="1"
        value="1"
        label="Disabled, Invalid, Checked"
        disabled
        isInvalid
        checked
      />
    </>
  );
};
