'use client';

import React, { ReactNode } from 'react';

import { UserButton, OrganizationSwitcher, useUser } from '@clerk/nextjs';
import { Box, Drawer } from '@mui/material';

import { NavigationList } from '@/components/NavigationMenu';
import { UserMenu } from '@/components/UserMenu';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { isLoaded } = useUser();

  return (
    <Box
      bgcolor="background.default"
      display="flex"
      sx={{
        width: '100vw',
        height: '100vh',
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
        <UserMenu />
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
        minWidth={0}
      >
        {children}
      </Box>
    </Box>
  );
};
