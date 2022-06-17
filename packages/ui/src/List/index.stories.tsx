import React from 'react';

import List from '.';
import ListItem from '../ListItem';

const Story = {
  title: 'List',
  component: List,
};
export default Story;

export const DefaultList = () => (
  <div style={{ maxWidth: 400 }}>
    <List>
      <ListItem>Item1</ListItem>
      <ListItem onClickInfo={() => {}}>Item2</ListItem>
      <ListItem>Item3</ListItem>
    </List>
  </div>
);
