import React from 'react';

import Form from '.';
import { Space, Input, FormItem } from '../../ui';

const Story = {
  title: 'Form',
  component: Form,
};
export default Story;

export const Forms = () => (
  <Space direction="vertical" size={12}>
    <Form>
      <FormItem label="Label">
        <Input value="Value" />
      </FormItem>
    </Form>
  </Space>
);
