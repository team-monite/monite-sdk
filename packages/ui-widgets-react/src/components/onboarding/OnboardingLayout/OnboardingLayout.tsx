import React, { ReactNode } from 'react';
import { Box, styled } from '@mui/material';
import { Global } from '@emotion/react';
import { palette } from '@team-monite/ui-kit-react';

import MaterialThemeProvider from 'core/MaterialThemeProvider';

import OnboardingHeader from './OnboardingHeader';
import OnboardingFooter from './OnboardingFooter';
import OnboardingNotification from './OnboardingNotification';
import OnboardingContainer from './OnboardingContainer';

export type OnboardingLayoutProps = {
  progress?: ReactNode;
  actions?: ReactNode;
  content: ReactNode;
  title: ReactNode;
};

const StyledLayout = styled(Box)`
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing(10.5)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding-top: ${({ theme }) => theme.spacing(9)};
    padding-bottom: ${({ theme }) => theme.spacing(4)};
  }
`;

const StyledContent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export default function OnboardingLayout({
  progress,
  content,
  title,
}: OnboardingLayoutProps) {
  return (
    <MaterialThemeProvider>
      <Global
        styles={{ body: { backgroundColor: palette.neutral90, minWidth: 320 } }}
      />
      <StyledLayout>
        <OnboardingHeader />
        <OnboardingContainer>
          <OnboardingNotification />
          {title}
          <StyledContent>{content}</StyledContent>
        </OnboardingContainer>
        <OnboardingFooter />
        {progress}
      </StyledLayout>
    </MaterialThemeProvider>
  );
}
