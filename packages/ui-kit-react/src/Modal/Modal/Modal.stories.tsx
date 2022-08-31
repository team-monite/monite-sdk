import { useState } from 'react';

import Button from '../../Button';
import Modal from './Modal';

import {
  DefaultModalLayout,
  ModalLayoutWithScroll,
  FullScreenModalLayout,
} from '../ModalLayout/ModalLayout.stories';

const Story = {
  title: 'Layout/Modal',
  component: Modal,
};

export default Story;

export const DefaultModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size={'sm'}>
        Open modal
      </Button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <DefaultModalLayout />
        </Modal>
      )}
    </>
  );
};

export const ModalWithScroll = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size={'sm'}>
        Open modal
      </Button>

      {open && (
        <Modal onClose={() => setOpen(false)}>
          <ModalLayoutWithScroll />
        </Modal>
      )}
    </>
  );
};

export const FullScreenModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <>
      <Button onClick={show} size={'sm'}>
        Open modal
      </Button>

      {open && (
        <Modal onClose={hide}>
          <FullScreenModalLayout onHide={hide} />
        </Modal>
      )}
    </>
  );
};
