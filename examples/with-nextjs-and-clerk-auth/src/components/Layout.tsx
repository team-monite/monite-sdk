'use client';

import React, { ReactNode } from 'react';

import { Box, Drawer } from '@mui/material';

import { NavigationList } from '@/components/NavigationMenu';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { UserButton } from '@/components/UserButton';

export const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = location.pathname;
  const currentPath = pathname == '/' ? 'root' : pathname.substring(1);

  return (
    <Box
      bgcolor="background.default"
      display="flex"
      className={`Monite-Page-${currentPath}`}
      sx={{
        position: 'absolute',
        left: '0',
        right: '0',
        top: '0',
        bottom: '0',
        overflow: 'hidden',
      }}
    >
      <Drawer
        anchor="left"
        className="LayoutNavigationDrawer"
        sx={{
          width: 240,
        }}
        PaperProps={{ sx: { width: 240 } }}
        variant="permanent"
      >
        <Box display="flex" flexDirection="row" gap={2} mt={4} mx={3} mb={3}>
          <UserButton />
          <OrganizationSwitcher />
        </Box>
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          mt={1}
          mb={3}
          mx={0}
        >
          <NavigationList />
        </Box>
      </Drawer>
      <Box
        component="main"
        className="Monite-ContentContainer"
        flexGrow={1}
        mx={4}
        mt={4}
        mb={0}
        minWidth={0}
      >
        {children}
      </Box>
    </Box>
  );
};
