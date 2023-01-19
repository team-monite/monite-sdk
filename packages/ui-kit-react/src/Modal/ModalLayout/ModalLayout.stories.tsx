import styled from '@emotion/styled';

import ModalLayout from './ModalLayout';
import Button from '../../Button';
import Text from '../../Text';
import Tag from '../../Tag';
import Header from '../../Header';
import { Flex } from '../../Box';
import IconButton from '../../IconButton';
import { UMultiply } from '../../unicons';

const Story = {
  title: 'Layout/Modal/Modal Layout',
  component: ModalLayout,
};

export default Story;

export const DefaultModalLayout = () => {
  return (
    <ModalLayout>
      <div style={{ padding: 20 }}>
        {[...new Array(1)].map((key) => (
          <p key={key}>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et.
          </p>
        ))}
      </div>
    </ModalLayout>
  );
};

export const ModalLayoutWithScroll = () => {
  return (
    <ModalLayout scrollableContent fullHeight>
      <div style={{ padding: 20 }}>
        {[...new Array(10)].map((key) => (
          <p key={key}>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et.
          </p>
        ))}
      </div>
    </ModalLayout>
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

export const FullScreenModalLayout = ({ onHide }: { onHide: () => void }) => {
  return (
    <ModalLayout
      fullScreen
      scrollableContent
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
            <IconButton onClick={onHide} color={'black'}>
              <UMultiply size={18} />
            </IconButton>
          }
          actions={
            <StyledHeaderActions>
              <Button color={'secondary'} onClick={onHide}>
                Save
              </Button>
              <Button type={'submit'}>Submit</Button>
            </StyledHeaderActions>
          }
        >
          <StyledHeaderContent>
            <Text textSize={'h3'}>Mindspace GmbH</Text>
            <Tag color={'secondary'}>Draft</Tag>
          </StyledHeaderContent>
        </Header>
      }
    >
      <div style={{ padding: 32, backgroundColor: '#F3F3F3' }}>
        {[...new Array(10)].map((key) => (
          <p key={key}>
            Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
            dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta
            ac consectetur ac, vestibulum at eros. Praesent commodo cursus
            magna, vel scelerisque nisl consectetur et.
          </p>
        ))}
      </div>
    </ModalLayout>
  );
};
