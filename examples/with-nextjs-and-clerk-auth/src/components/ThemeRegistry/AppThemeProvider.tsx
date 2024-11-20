'use client';

import React, { PropsWithChildren, useCallback } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@clerk/nextjs';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Theme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';

import * as themes from '@/themes';

type RootThemeProviderProps = PropsWithChildren;

export function AppThemeProvider(props: RootThemeProviderProps) {
  const { children } = props;

  const { userId } = useAuth();
  const { i18n } = useLingui();

  const queryClient = useQueryClient();

  return (
    <ThemeProvider theme={themes.moniteLight()}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
