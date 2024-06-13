'use client';

import React, { ReactNode } from 'react';

import { Box, Drawer } from '@mui/material';

import { NavigationMenu } from '@/components/NavigationMenu';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { UserButton } from '@/components/UserButton';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        PaperProps={{ sx: { backgroundColor: 'paper' } }}
        sx={{
          width: '240px',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '240px',
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: 'flex',
            padding: 2,
            gap: 2,
            alignItems: 'flex-start',
            boxSizing: 'border-box',
            zIndex: 10,
          }}
        >
          <UserButton />
          <OrganizationSwitcher />
        </Box>

        <NavigationMenu />
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          px: 3,
          py: 1,
          minWidth: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
