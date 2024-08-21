import { ReactNode } from 'react';

import { Box, styled } from '@mui/material';

export type OnboardingContentProps = {
  children: ReactNode;
};

export function OnboardingContainer({ children }: OnboardingContentProps) {
  return <StyledContainer>{children}</StyledContainer>;
}

const StyledContainer = styled(Box)`
  max-width: calc(460px + 2 * ${({ theme }) => theme.spacing(4)});
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin: 0 auto;
  justify-content: center;

  ${({ theme }) => theme.breakpoints.up('md')} {
    padding: ${({ theme }) => theme.spacing(4, 4, 0)};
  }

  ${({ theme }) => theme.breakpoints.down('md')} {
    box-sizing: border-box;
    padding: ${({ theme }) => theme.spacing(2, 1, 0)};
  }
`;
