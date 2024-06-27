'use client';

import React, { ReactNode } from 'react';

import { Box } from '@mui/material';
import { ThemeSelect } from '@team-monite/sdk-demo';

import { NavigationList } from '@/components/NavigationMenu';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { useAppTheme } from '@/components/ThemeRegistry/AppThemeProvider';
import { UserButton } from '@/components/UserButton';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { selectedTheme, onThemeChange } = useAppTheme();

  return (
    <Box bgcolor="background.default" display="flex" minHeight="100vh">
      <Box
        bgcolor="#F1F2F5"
        display="flex"
        flexDirection="column"
        width="240px"
      >
        <Box display="flex" flexDirection="row" gap={2} mx={1.5} mt={3}>
          <UserButton />
          <OrganizationSwitcher />
        </Box>
        <Box display="flex" flex="1" flexDirection="column" mx={1.5} my={3}>
          <NavigationList />
        </Box>
        <Box mx={1.5} mb={3} width="100%">
          <ThemeSelect value={selectedTheme} onChange={onThemeChange} />
        </Box>
      </Box>
      <Box component="main" flexGrow={1} mx={3} my={1} minWidth={0}>
        {children}
      </Box>
    </Box>
  );
};
