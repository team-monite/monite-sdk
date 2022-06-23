import React from 'react';

import Modal from '.';

const Story = {
  title: 'Components/Modal',
  component: Modal,
};
export default Story;

export const DefaultModal = () => {
  return (
    <Modal onClickBackdrop={() => {}}>
      <div style={{ padding: 20 }}>Content</div>
    </Modal>
  );
};
