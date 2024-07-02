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
    <Box bgcolor="background.default" display="flex">
      <Drawer
        anchor="left"
        PaperProps={{ sx: { backgroundColor: 'background.menu' } }}
        className="LayoutNavigationDrawer"
        sx={{ width: 240 }}
        variant="permanent"
      >
        <Box display="flex" flexDirection="row" gap={2} m={2}>
          <UserButton />
          <OrganizationSwitcher />
        </Box>
        <Box display="flex" flex="1" flexDirection="column" mt={1}>
          <NavigationList />
        </Box>
        <Box display="flex" flexShrink="1" mx={1.5} mb={3} mt={2}>
          <ThemeSelect
            selectedTheme={selectedTheme}
            onThemeChange={onThemeChange}
          />
        </Box>
      </Drawer>
      <Box component="main" flexGrow={1} minWidth={0} m={4}>
        {children}
      </Box>
    </Box>
  );
};
