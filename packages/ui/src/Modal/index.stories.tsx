import { useState } from 'react';

import Modal from '.';
import Button from '../Button';
import Text from '../Text';
import Tag from '../Tag';
import Header from '../Header';
import styled from '@emotion/styled';
import { Flex } from '../Box';

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
        <Modal
          onClickBackdrop={() => {
            setOpen(false);
          }}
        >
          <div style={{ padding: 20 }}>Content</div>
        </Modal>
      )}
    </>
  );
};

const StyledContent = styled(Flex)`
  align-items: center;
  gap: 24px;
`;

const StyledActions = styled(Flex)`
  align-items: center;
  gap: 12px;
`;

export const FullScreenModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size={'sm'}>
        Open modal
      </Button>
      {open && (
        <Modal
          fullScreen
          onClickBackdrop={() => {
            setOpen(false);
          }}
        >
          <Header
            onClose={() => {}}
            actions={
              <StyledActions>
                <Button color={'secondary'}>Save</Button>
                <Button type={'submit'}>Submit</Button>
              </StyledActions>
            }
          >
            <StyledContent>
              <Text textSize={'h3'}>Mindspace GmbH</Text>
              <Tag color={'draft'}>Draft</Tag>
            </StyledContent>
          </Header>
          <div style={{ padding: 20 }}>Content</div>
        </Modal>
      )}
    </>
  );
};
