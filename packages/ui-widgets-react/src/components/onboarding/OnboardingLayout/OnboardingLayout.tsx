import React, { ReactNode } from 'react';
import { Box, styled } from '@mui/material';
import { Global } from '@emotion/react';
import { palette } from '@team-monite/ui-kit-react';

import MaterialThemeProvider from 'core/MaterialThemeProvider';

import OnboardingHeader from './OnboardingHeader';
import OnboardingFooter from './OnboardingFooter';

export type OnboardingLayoutProps = {
  progress: ReactNode;
  children: ReactNode;
};

const StyledLayout = styled(Box)`
  height: 100vh;
  position: relative;
`;

export default function OnboardingLayout({
  progress,
  children,
}: OnboardingLayoutProps) {
  return (
    <MaterialThemeProvider>
      <Global styles={{ body: { backgroundColor: palette.neutral90 } }} />
      <StyledLayout>
        {children}
        <OnboardingHeader />
        <OnboardingFooter />
        {progress}
      </StyledLayout>
    </MaterialThemeProvider>
  );
}
