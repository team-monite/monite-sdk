import React from 'react';
import styled from '@emotion/styled';
import {
  UQuestionCircle,
  THEMES,
  Avatar,
  Box,
  Text,
  Flex,
} from '@team-monite/ui-kit-react';

import Menu from './Menu';
import MenuItem from './Menu/MenuItem';
import useAuth from 'features/auth/useAuth';

import styles from './styles.module.scss';

const Sider = styled(Flex)`
  position: sticky;
  top: 0;
  height: 100vh;

  flex-direction: column;
  background: ${({ theme }) => theme.neutral90};

  a {
    color: ${({ theme }) => theme.black};
    text-decoration: none;
  }
`;

type DefaultLayoutProps = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const appAuth = useAuth();

  return (
    <Flex className={styles.layout}>
      <Sider className={styles.sider} width={240}>
        <Flex alignItems="center" ml={12}>
          <Avatar size={44}>M</Avatar>
          <Box ml={12}>
            <Text textSize="smallBold">Silver Wind LLC</Text>
          </Box>
        </Flex>
        <Box flex={1}>
          <Menu />
        </Box>
        <Box>
          <MenuItem
            item={{
              url: '/logout',
              onClick: (e: React.BaseSyntheticEvent) => {
                e.stopPropagation();
                e.preventDefault();

                appAuth?.onLogout();
              },
              label: 'Logout',
              renderIcon: () => (
                <UQuestionCircle
                  color={THEMES.default.colors.primary}
                  width={20}
                  height={20}
                />
              ),
            }}
          />
        </Box>
      </Sider>
      <Box flex={1}>
        <div className={styles.content}>{children}</div>
      </Box>
    </Flex>
  );
};

export default DefaultLayout;
