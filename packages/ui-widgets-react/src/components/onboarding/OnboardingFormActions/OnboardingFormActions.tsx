import React, { ReactNode } from 'react';
import { Box, Paper, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';

export type OnboardingFormActionsProps = {
  save?: ReactNode;
  back?: ReactNode;
  next?: ReactNode;
  submit?: ReactNode;
};

const StyledActions = styled(Paper)`
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing(2)};
  z-index: 3;
  border-top: 1px solid ${palette.neutral90};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    position: static;
    border-radius: ${({ theme }) => theme.spacing(0, 0, 1.5, 1.5)};
    margin-top: ${({ theme }) => `-${theme.spacing(1)}`};
`;

const StyledRightBlock = styled(Box)`
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

export default function OnboardingFormActions({
  save,
  back,
  next,
  submit,
}: OnboardingFormActionsProps) {
  return (
    <StyledActions square elevation={0}>
      {save}
      <StyledRightBlock>
        {back}
        {next}
        {submit}
      </StyledRightBlock>
    </StyledActions>
  );
}
