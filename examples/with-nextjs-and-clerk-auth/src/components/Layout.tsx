'use client';

import React, { ReactNode } from 'react';

import { css, useTheme } from '@emotion/react';
import { Box, Drawer } from '@mui/material';
import { TestComp } from '@team-monite/sdk-demo';

import { NavigationMenu } from '@/components/NavigationMenu';
import { OrganizationSwitcher } from '@/components/OrganizationSwitcher';
import { UserButton } from '@/components/UserButton';

export const Layout = ({ children }: { children: ReactNode }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex' }}>
      <TestComp />
    </Box>
  );
};
