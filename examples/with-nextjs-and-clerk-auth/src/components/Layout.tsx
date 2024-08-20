'use client';

import React, { ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { Box, Drawer } from '@mui/material';

import { NavigationList } from '@/components/NavigationMenu';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { UserButton } from '@/components/UserButton';

export const Layout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const currentPath = pathname == '/' ? 'root' : pathname.substring(1);

  return (
    <Box
      bgcolor="background.default"
      display="flex"
      className={`Monite-Page-${currentPath}`}
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
        minWidth={0}
      >
        {children}
      </Box>
    </Box>
  );
};
