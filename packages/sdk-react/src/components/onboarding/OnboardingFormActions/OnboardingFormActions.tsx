import React, { ReactNode } from 'react';

import { Box, Button, styled } from '@mui/material';

import { useOnboardingActions } from '../hooks';

const StyledActions = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(1)};
  padding: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(2, 0)};
  }
`;

type OnboardingFormActionsTemplateProps = {
  primaryLabel: string;
  onPrimaryAction?: () => void;
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
  isLoading?: boolean;
  deleteButton?: ReactNode;
};

export function OnboardingFormActionsTemplate({
  isLoading,
  primaryLabel,
  onPrimaryAction,
  secondaryLabel,
  onSecondaryAction,
  deleteButton,
}: OnboardingFormActionsTemplateProps) {
  return (
    <StyledActions>
      <Button
        onClick={onPrimaryAction}
        disabled={isLoading}
        type="submit"
        variant="contained"
        color="primary"
        size="large"
      >
        {primaryLabel}
      </Button>

      {secondaryLabel && (
        <Button
          disabled={isLoading}
          onClick={onSecondaryAction}
          variant="outlined"
          color="primary"
          size="large"
        >
          {secondaryLabel}
        </Button>
      )}

      {deleteButton}
    </StyledActions>
  );
}

type OnboardingFormActionsProps = {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  isLoading?: boolean;
  deleteButton?: ReactNode;
};

export function OnboardingFormActions({
  onPrimaryAction,
  onSecondaryAction,
  isLoading,
  deleteButton,
}: OnboardingFormActionsProps) {
  const { primaryLabel, secondaryLabel } = useOnboardingActions();

  return (
    <OnboardingFormActionsTemplate
      isLoading={isLoading}
      primaryLabel={primaryLabel}
      secondaryLabel={secondaryLabel}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      deleteButton={deleteButton}
    />
  );
}
