import React from 'react';

import FormItem from '.';
import { Space, Input, MessageIcon } from '../../ui';

const Story = {
  title: 'FormItem',
  component: FormItem,
};
export default Story;

export const Inputs = () => (
  <Space direction="vertical" size={12}>
    <FormItem label="Label">
      <Input defaultValue="Value" />
    </FormItem>
    <FormItem label="Label" required>
      <Input value="Value" />
    </FormItem>
    <FormItem
      label="Label"
      required
      validateStatus="error"
      help="Should be combination of numbers & alphabets"
    >
      <Input value="Value" />
    </FormItem>
    <FormItem label="Warning" validateStatus="warning">
      <Input placeholder="Warning" id="warning" prefix={<MessageIcon />} />
    </FormItem>
    <FormItem
      label="Validating"
      hasFeedback
      validateStatus="validating"
      help="The information is being validated..."
    >
      <Input placeholder="I'm the content is being validated" id="validating" />
    </FormItem>
    <FormItem
      label="Fail"
      hasFeedback
      validateStatus="error"
      help="Should be combination of numbers & alphabets"
      extra="Help tooltip"
    >
      <Input placeholder="I'm the content" />
    </FormItem>
  </Space>
);
