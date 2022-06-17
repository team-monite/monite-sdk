import React from 'react';

import FormField from '.';
import Input from '../Input';
import PasswordInput from '../PasswordInput';
import Select from '../Select';

const Story = {
  title: 'FormField',
  component: FormField,
};
export default Story;

export const DefaultForm = () => (
  <div style={{ maxWidth: 400, position: 'relative' }}>
    <FormField id="name" label="Name" text="Some text">
      <Input placeholder="Name" />
    </FormField>
    <br />
    <FormField id="surname" label="Surname" error="Some error">
      <Input placeholder="Surname" error="Some error" isInvalid />
    </FormField>
    <br />
    <FormField id="city" label="City">
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
    <FormField id="password" label="Password">
      <PasswordInput required />
    </FormField>
    <br />
    <FormField
      id="repeatPassword"
      label="Repeat password"
      error="Some error message"
    >
      <PasswordInput required isInvalid />
    </FormField>
  </div>
);
