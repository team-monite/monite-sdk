import React from 'react';

import ListItem from '.';
import { List, Space } from '../../ui';

const Story = {
  title: 'List',
  component: List,
};
export default Story;

const data = [
  {
    name: 'Jack',
  },
  {
    name: 'Lucy',
  },
  {
    name: 'Disabled',
  },
];

const CustomList = ({ ...props }) => (
  <List
    dataSource={data}
    renderItem={(item: any) => <ListItem>{item.name}</ListItem>}
    {...props}
  />
);

export const Lists = () => (
  <Space direction="vertical" size={16}>
    <CustomList />
    <CustomList
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      bordered
    />
  </Space>
);
