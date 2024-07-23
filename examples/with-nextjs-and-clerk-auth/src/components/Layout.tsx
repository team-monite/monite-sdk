'use client';

import React, { ReactNode } from 'react';

import { Box, Drawer } from '@mui/material';

import { NavigationList } from '@/components/NavigationMenu';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { useAppTheme } from '@/components/ThemeRegistry/AppThemeProvider';
import { ThemeSelect } from '@/components/ThemeSelect/ThemeSelect';
import { UserButton } from '@/components/UserButton';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { selectedTheme, onThemeChange } = useAppTheme();

  return (
    <Box
      bgcolor="background.default"
      display="flex"
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
        <Box display="flex" flex="1" flexDirection="column" mt={1} mx={0}>
          <NavigationList />
        </Box>
        <Box display="flex" flexShrink="1" mx={1.5} mb={3} mt={4}>
          <ThemeSelect
            selectedTheme={selectedTheme}
            onThemeChange={onThemeChange}
          />
        </Box>
      </Drawer>
      <Box
        component="main"
        flexGrow={1}
        mx={4}
        my={4}
        minWidth={0}
        maxHeight="100%"
        sx={{
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
