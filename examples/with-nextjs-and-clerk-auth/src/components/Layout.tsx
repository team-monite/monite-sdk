'use client';

import React, { ReactNode } from 'react';

import { UserButton, OrganizationSwitcher, useUser } from '@clerk/nextjs';
import { Box, Drawer } from '@mui/material';

import { NavigationList } from '@/components/NavigationMenu';

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
        <Box display="flex" flexDirection="row" gap={2} mt={4} mx={3} mb={3}>
          <UserButton />
          <OrganizationSwitcher hidePersonal={true} />
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
        minWidth={0}
      >
        {children}
      </Box>
    </Box>
  );
};
