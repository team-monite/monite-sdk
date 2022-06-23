import React from 'react';
import styled from '@emotion/styled';
import { Avatar, Box, Text, Flex } from '@monite/react-kit';

import Menu from './Menu';

import styles from './styles.module.scss';

const Sider = styled(Box)`
  background: ${(props: any) => props.theme.colors.lightGrey3};
`;

type DefaultLayoutProps = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <Flex className={styles.layout}>
      <Sider className={styles.sider} width={240}>
        <Flex alignItems="center" ml={12}>
          <Avatar size={44} onlyLetter name="M" />
          <Box ml={12}>
            <Text textSize="smallBold">Silver Wind LLC</Text>
          </Box>
        </Flex>
        <Menu />
      </Sider>
      <Box flex={1}>
        <div className={styles.content}>{children}</div>
      </Box>
    </Flex>
  );
};

export default DefaultLayout;
