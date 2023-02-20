import React, { ReactNode } from 'react';
import { Box, styled } from '@mui/material';

export type OnboardingContentProps = {
  children: ReactNode;
};

const StyledContainer = styled(Box)`
  max-width: 520px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 auto;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(4, 4, 0)};
    justify-content: center;
  }
`;

export default function OnboardingContainer({
  children,
}: OnboardingContentProps) {
  return <StyledContainer>{children}</StyledContainer>;
}
