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
  background-color: ${({ theme }) => theme.palette.background.default};
  box-sizing: border-box;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledContent = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
`;
