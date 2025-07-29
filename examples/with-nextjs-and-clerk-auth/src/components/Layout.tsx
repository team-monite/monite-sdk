'use client';

import { NavigationList } from '@/components/NavigationMenu';
import { UserMenu } from '@/components/UserMenu';
import { AIAssistant } from '@monite/sdk-react';
import { Box, Drawer } from '@mui/material';
import React, { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      bgcolor="white"
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
          width: 260,
          borderRight: '1px solid #F0F2F4',
          borderColor: '#F0F2F4',
        }}
        PaperProps={{ sx: { width: 260 } }}
        variant="permanent"
      >
        <UserMenu />
        <Box
          display="flex"
          flex="1"
          flexDirection="column"
          pt={2}
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

      <AIAssistant />
    </Box>
  );
};
