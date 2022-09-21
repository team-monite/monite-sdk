import { useState } from 'react';

import Button from '../../Button';
import Modal from './Modal';

import {
  DefaultModalLayout,
  ModalLayoutWithScroll,
  FullScreenModalLayout,
} from '../ModalLayout/ModalLayout.stories';
import { ModalLayout } from '../ModalLayout';

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

export const Drawer = () => {
  const [open, setOpen] = useState<boolean>(false);
  const show = () => setOpen(true);
  const hide = () => setOpen(false);

  return (
    <>
      <Button onClick={show} size={'sm'}>
        Open modal
      </Button>

      {open && (
        <Modal anchor={'right'} onClose={hide}>
          <ModalLayout isDrawer>
            {[...new Array(10)].map((key) => (
              <p key={key}>
                Cras mattis consectetur purus sit amet fermentum. Cras justo
                odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                risus, porta ac consectetur ac, vestibulum at eros. Praesent
                commodo cursus magna, vel scelerisque nisl consectetur et.
              </p>
            ))}
          </ModalLayout>
        </Modal>
      )}
    </>
  );
};
