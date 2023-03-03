import React, { ReactNode } from 'react';
import { Box, styled } from '@mui/material';

export type OnboardingFormProps = {
  children: ReactNode;
  onSubmit?: () => void;
  actions: ReactNode;
};

const StyledContent = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  flex-direction: column;
`;

export default function OnboardingForm({
  children,
  onSubmit,
  actions,
}: OnboardingFormProps) {
  return (
    <form noValidate onSubmit={onSubmit}>
      <StyledContent>{children}</StyledContent>
      {actions}
    </form>
  );
}
