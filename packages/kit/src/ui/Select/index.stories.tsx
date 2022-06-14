import React from 'react';

import Select from '.';
import { Option as SelectOption, Space } from '../../ui';

const Story = {
  title: 'Select',
  component: Select,
};
export default Story;

const CustomSelect = ({ ...props }) => (
  <Select {...props} style={{ width: 200 }} onChange={() => {}}>
    <SelectOption value="jack">Jack</SelectOption>
    <SelectOption value="lucy">Lucy</SelectOption>
    <SelectOption value="disabled" disabled>
      Disabled
    </SelectOption>
  </Select>
);

export const Selects = () => (
  <Space direction="vertical" size={16}>
    <CustomSelect />
    <CustomSelect defaultValue="lucy" />
    <CustomSelect disabled defaultValue="lucy" />
    <CustomSelect status="error" defaultValue="lucy" />
    <CustomSelect mode="tags" />
    <CustomSelect mode="tags" defaultValue="lucy" />
    <CustomSelect showSearch defaultValue="lucy" onSearch={() => {}} />
  </Space>
);
