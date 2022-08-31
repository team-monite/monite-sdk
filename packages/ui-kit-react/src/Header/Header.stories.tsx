import { ComponentStory } from '@storybook/react';

import styled from '@emotion/styled';
import Header from './Header';
import { Box, Flex } from '../Box';
import Text from '../Text';
import Tag from '../Tag';
import Button from '../Button';
import Avatar from '../Avatar';
import IconButton from '../IconButton';
import { UMultiply } from '../unicons';

const Story = {
  title: 'Navigation/Header',
  component: Header,
};

export default Story;

const Wrap = ({ children }) => (
  <Box
    sx={{
      width: '100%',
      backgroundColor: '#F3F3F3',
      padding: '20px',
    }}
  >
    {children}
  </Box>
);

const StyledContent = styled(Flex)`
  align-items: center;
  gap: 24px;
`;

const StyledActions = styled(Flex)`
  align-items: center;
  gap: 12px;
`;

const Template: ComponentStory<typeof Header> = ({ children, ...args }) => (
  <Wrap>
    <Header {...args}>{children}</Header>
  </Wrap>
);

export const DefaultHeader = Template.bind({});

DefaultHeader.args = {
  children: 'New title',
  onClose: undefined,
};

export const FullScreenModalHeader = () => {
  return (
    <Template
      leftBtn={
        <IconButton color={'black'}>
          <UMultiply size={18} />
        </IconButton>
      }
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
    </Template>
  );
};

export const SidebarHeader = () => {
  return (
    <Template
      rightBtn={
        <IconButton color={'black'}>
          <UMultiply size={18} />
        </IconButton>
      }
    >
      <StyledContent sx={{ gap: '16px !important' }}>
        <Avatar src={'https://cdn-icons-png.flaticon.com/512/616/616554.png'} />
        <Text textSize={'h3'}>Sidebar Title</Text>
      </StyledContent>
    </Template>
  );
};
