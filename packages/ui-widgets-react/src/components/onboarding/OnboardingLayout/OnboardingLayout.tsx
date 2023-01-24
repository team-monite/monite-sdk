import React, { ReactNode } from 'react';
import { Box, styled } from '@mui/material';
import { Global } from '@emotion/react';
import { palette } from '@team-monite/ui-kit-react';

import MaterialThemeProvider from 'core/MaterialThemeProvider';

import OnboardingHeader from './OnboardingHeader';
import OnboardingFooter from './OnboardingFooter';
import OnboardingNotification from './OnboardingNotification';
import OnboardingContainer from './OnboardingContainer';
import OnboardingTitle from './OnboardingTitle';
import { useTranslation } from 'react-i18next';

export type OnboardingLayoutProps = {
  progress: ReactNode;
  children: ReactNode;
};

const StyledLayout = styled(Box)`
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing(10.5)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding-top: ${({ theme }) => theme.spacing(9)};
    padding-bottom: ${({ theme }) => theme.spacing(4)};
  }
`;

export default function OnboardingLayout({
  progress,
  children,
}: OnboardingLayoutProps) {
  const { t } = useTranslation();

  return (
    <MaterialThemeProvider>
      <Global
        styles={{ body: { backgroundColor: palette.neutral90, minWidth: 320 } }}
      />
      <StyledLayout>
        <OnboardingHeader />
        <OnboardingContainer>
          <OnboardingNotification />
          <OnboardingTitle
            step={`${t('onboarding:step')} 1`}
            title={t('onboarding:basicInformation.title')}
            description={t('onboarding:basicInformation.description')}
          />
          {children}
        </OnboardingContainer>
        <OnboardingFooter />
        {progress}
      </StyledLayout>
    </MaterialThemeProvider>
  );
}
