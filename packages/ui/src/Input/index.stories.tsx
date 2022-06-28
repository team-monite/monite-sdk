import React, { useState } from 'react';

import Input from '.';
import { ComponentStory } from '@storybook/react';

const Story = {
  title: 'Components/Input',
  component: Input,
};
export default Story;

const Template: ComponentStory<typeof Input> = (args) => {
  const [value, setValue] = useState<string>('');

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <Input value={value} onChange={(e) => onChange(e.target.value)} {...args} />
  );
};

export const DefaultInput = Template.bind({});

DefaultInput.args = {
  readOnly: false,
  isInvalid: false,
};

DefaultInput.argTypes = {
  readOnly: { control: 'boolean' },
  isInvalid: { control: 'boolean' },
};
