import React, { ReactNode } from 'react';

import { Paper, styled } from '@mui/material';

export type OnboardingStepContentProps = {
  children: ReactNode;
  title?: ReactNode;
};

export function OnboardingStepContent({
  children,
  title,
}: OnboardingStepContentProps) {
  return (
    <StyledPaper square variant="outlined">
      {title}
      {children}
    </StyledPaper>
  );
}

const StyledPaper = styled(Paper)`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing(3, 2)};
  gap: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.spacing(1.5)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;
