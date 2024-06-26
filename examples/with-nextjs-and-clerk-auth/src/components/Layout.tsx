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
      <Drawer sx={{ width: 240 }} variant="permanent" anchor="left">
        <Box display="flex" flexDirection="row" gap={2} mx={1.5} mt={3}>
          <UserButton />
          <OrganizationSwitcher />
        </Box>
        <Box display="flex" flex="1" flexDirection="column" mx={1} my={3}>
          <NavigationList />
        </Box>
        <Box display="flex" flexShrink="1" mx={1} mb={3}>
          <ThemeSelect
            selectedTheme={selectedTheme}
            onThemeChange={onThemeChange}
          />
        </Box>
      </Drawer>
      <Box component="main" flexGrow={1} mx={3} my={1} minWidth={0}>
        {children}
      </Box>
    </Box>
  );
};
