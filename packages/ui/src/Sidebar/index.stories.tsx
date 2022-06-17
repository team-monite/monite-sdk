import React from 'react';

import Sidebar from '.';

const Story = {
  title: 'Sidebar',
  component: Sidebar,
};
export default Story;

export const DefaultSidebar = () => {
  return (
    <Sidebar onClickBackdrop={() => {}}>
      <div style={{ padding: 20 }}>Content</div>
    </Sidebar>
  );
};
