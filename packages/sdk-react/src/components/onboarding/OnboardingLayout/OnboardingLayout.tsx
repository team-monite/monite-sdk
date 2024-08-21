import { ReactNode } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { Box, styled } from '@mui/material';

import { OnboardingContainer, OnboardingFooter } from '../components';
import { OnboardingHeader } from './OnboardingHeader';

export type OnboardingLayoutProps = {
  actions?: ReactNode;
  content?: ReactNode;
  title: ReactNode;
};

export function OnboardingLayout({ content, title }: OnboardingLayoutProps) {
  return (
    <StyledLayout className={ScopedCssBaselineContainerClassName}>
      <OnboardingHeader />
      <OnboardingContainer>
        {title}
        <StyledContent>{content}</StyledContent>
      </OnboardingContainer>
      <OnboardingFooter />
    </StyledLayout>
  );
}

const StyledLayout = styled(Box)`
  position: relative;
  padding-bottom: ${({ theme }) => theme.spacing(10.5)};
  background-color: ${({ theme }) => theme.palette.background.default};
  box-sizing: border-box;
  min-height: 100vh;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding-bottom: ${({ theme }) => theme.spacing(4)};
  }
`;

const StyledContent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;
