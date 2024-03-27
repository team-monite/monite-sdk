'use client';

import React, { ReactNode } from 'react';

import { css, useTheme } from '@emotion/react';
import { Box, Drawer } from '@mui/material';

import { NavigationMenu } from '@/components/NavigationMenu';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { UserButton } from '@/components/UserButton';

export const Layout = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

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
        <div
          css={css`
            display: flex;
            padding: ${theme.spacing(2)};
            gap: ${theme.spacing(2)};
            align-items: flex-start;
            box-sizing: border-box;
            z-index: 10;
          `}
        >
          <UserButton />
          <OrganizationSwitcher />
        </div>

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
