import React, { ReactNode } from 'react';
import { Paper, styled } from '@mui/material';

export type OnboardingStepContentProps = {
  children: ReactNode;
};

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(3, 2)};
  gap: ${({ theme }) => theme.spacing(3)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(4)};
    border-radius: ${({ theme }) => theme.spacing(1.5)};

    &:last-child {
      border-radius: ${({ theme }) => theme.spacing(1.5, 1.5, 0, 0)};
    }
  }
`;

export default function OnboardingStepContent({
  children,
}: OnboardingStepContentProps) {
  return (
    <StyledPaper square elevation={0}>
      {children}
    </StyledPaper>
  );
}
