import { useState } from 'react';

import styled from '@emotion/styled';

import Modal from './Modal';
import Button from '../Button';
import Text from '../Text';
import Tag from '../Tag';
import Header from '../Header';
import { Flex } from '../Box';
import IconButton from '../IconButton';
import { UMultiply } from '../unicons';

const Story = {
  title: 'Components/Modal',
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
          <div style={{ padding: 20 }}>
            {[...new Array(1)].map((key) => (
              <p key={key}>
                Cras mattis consectetur purus sit amet fermentum. Cras justo
                odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                risus, porta ac consectetur ac, vestibulum at eros. Praesent
                commodo cursus magna, vel scelerisque nisl consectetur et.
              </p>
            ))}
          </div>
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
          <div style={{ padding: 20 }}>
            {[...new Array(10)].map((key) => (
              <p key={key}>
                Cras mattis consectetur purus sit amet fermentum. Cras justo
                odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                risus, porta ac consectetur ac, vestibulum at eros. Praesent
                commodo cursus magna, vel scelerisque nisl consectetur et.
              </p>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};

const StyledHeaderContent = styled(Flex)`
  align-items: center;
  gap: 24px;
`;

const StyledHeaderActions = styled(Flex)`
  align-items: center;
  gap: 12px;
`;

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
        <Modal
          fullScreen
          onClose={hide}
          footer={
            <Flex
              sx={{
                height: '48px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text textSize={'h4'}>Footer</Text>
            </Flex>
          }
          header={
            <Header
              leftBtn={
                <IconButton onClick={hide} color={'black'}>
                  <UMultiply size={18} />
                </IconButton>
              }
              actions={
                <StyledHeaderActions>
                  <Button color={'secondary'} onClick={hide}>
                    Save
                  </Button>
                  <Button type={'submit'}>Submit</Button>
                </StyledHeaderActions>
              }
            >
              <StyledHeaderContent>
                <Text textSize={'h3'}>Mindspace GmbH</Text>
                <Tag color={'draft'}>Draft</Tag>
              </StyledHeaderContent>
            </Header>
          }
        >
          <div style={{ padding: 32, backgroundColor: '#F3F3F3' }}>
            {[...new Array(10)].map((key) => (
              <p key={key}>
                Cras mattis consectetur purus sit amet fermentum. Cras justo
                odio, dapibus ac facilisis in, egestas eget quam. Morbi leo
                risus, porta ac consectetur ac, vestibulum at eros. Praesent
                commodo cursus magna, vel scelerisque nisl consectetur et.
              </p>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
};
