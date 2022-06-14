import React from 'react';

import Input from '.';
import { MessageIcon, Space } from '../../ui';

const Story = {
  title: 'Input',
  component: Input,
};
export default Story;

export const Inputs = () => (
  <Space direction="vertical" size={12}>
    <Input />
    <Input value="Value" />
    <Input disabled />
    <Input disabled status="error" />
    <Input status="error" />
    <Input status="warning" />
    <Input placeholder="Placeholder" />
    <Input placeholder="Placeholder" value="Placeholder Value" />
    <Input placeholder="Disabled Placeholder" disabled />
    <Input
      placeholder="Placeholder"
      value="Disabled Value Placeholder"
      disabled
    />
    <Input placeholder="Error Placeholder" status="error" />
    <Input
      placeholder="Placeholder"
      value="Error Value Placeholder"
      status="error"
    />
    <Input placeholder="Warning Placeholder" status="warning" />
    <Input
      placeholder="Placeholder"
      value="Warning Value Placeholder"
      status="warning"
    />
    <Input value="Value" addonAfter="after" addonBefore="https://" />
    <Input placeholder="Placeholder" prefix={<MessageIcon />} />
    <Input placeholder="Warning" status="warning" prefix={<MessageIcon />} />
    <Input disabled placeholder="Disabled" prefix={<MessageIcon />} />
    <Input disabled prefix={<MessageIcon />} />
    <Input prefix={<MessageIcon />} />
  </Space>
);
