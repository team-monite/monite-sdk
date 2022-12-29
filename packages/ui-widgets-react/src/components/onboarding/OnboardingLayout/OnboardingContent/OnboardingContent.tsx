import React, { ReactNode } from 'react';
import { Box, Paper, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';

export type OnboardingContentProps = {
  children: ReactNode;
};

const StyledContent = styled(Box)`
  background-color: ${palette.neutral90};
  padding-top: 72px;
  display: flex;
  justify-content: center;
`;

const StyledPaper = styled(Paper)`
  width: 520px;
  margin: 44px 0;
  border-radius: 12px;
  padding: 16px;
`;

export default function OnboardingContent({
  children,
}: OnboardingContentProps) {
  return (
    <StyledContent>
      <StyledPaper elevation={0}>{children}</StyledPaper>
    </StyledContent>
  );
}
