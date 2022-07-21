import React, { useState } from 'react';
import { ComponentStory } from '@storybook/react';

import FormField from '.';
import Input from '../Input';
import PasswordInput from '../PasswordInput';
import Select from '../Select';

const Story = {
  title: 'Components/FormField',
  component: FormField,
};
export default Story;

const Template: ComponentStory<typeof FormField> = (args) => {
  const [value, setValue] = useState('');
  return (
    <FormField {...args}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        isInvalid={!!args.error}
        readOnly={args.readOnly}
      />
    </FormField>
  );
};

export const DefaultFormField = Template.bind({});

DefaultFormField.args = {
  id: 'name',
  label: 'Name',
  onClickInfo: undefined,
  error: '',
  text: '',
  labelTextSize: '',
  readOnly: undefined,
  required: false,
};

DefaultFormField.argTypes = {
  error: { control: 'text' },
  text: { control: 'text' },
  labelTextSize: { control: 'text' },
  readOnly: { control: 'boolean' },
  required: { control: 'boolean' },
};

export const DefaultForm = () => (
  <div style={{ maxWidth: 400, position: 'relative' }}>
    <FormField id="name" label="Name" text="Some text" onClickInfo={() => {}}>
      <Input />
    </FormField>
    <br />
    <FormField id="surname" label="Surname" error="Some error">
      <Input error="Some error" isInvalid />
    </FormField>
    <br />
    <FormField id="city" label="City" required>
      <Input required />
    </FormField>
    <br />
    <FormField id="gender" label="Gender">
      <Select
        options={[
          {
            label: 'Male',
            value: '1',
          },
          {
            label: 'Female',
            value: '2',
          },
        ]}
      />
    </FormField>
    <br />
    <FormField id="role" label="Role">
      <Select
        placeholder=""
        options={[
          {
            label: 'Admin',
            value: '1',
          },
          {
            label: 'User',
            value: '2',
          },
        ]}
      />
    </FormField>
    <br />
    <FormField id="password" label="Password" required>
      <PasswordInput required />
    </FormField>
    <br />
    <FormField
      id="repeatPassword"
      label="Repeat password"
      error="Some error message"
      required
    >
      <PasswordInput required isInvalid />
    </FormField>
  </div>
);
