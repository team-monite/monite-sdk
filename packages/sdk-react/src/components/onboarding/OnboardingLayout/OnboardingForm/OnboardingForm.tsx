import { FormEventHandler, ReactNode } from 'react';

import { Box, styled } from '@mui/material';

export type OnboardingFormProps = {
  children: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  actions?: ReactNode;
};

const StyledContent = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(2)};
  flex-direction: column;
`;

export function OnboardingForm({
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
