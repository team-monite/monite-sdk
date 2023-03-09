import React from 'react';
import { Box, Button, Paper, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';
import { useTranslation } from 'react-i18next';

export type OnboardingFormActionsProps = {
  onSave?: () => void;
  onSubmit?: () => void;
  onBack?: () => void;
  isLoading: boolean;
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
  onSave,
  onSubmit,
  isLoading,
}: OnboardingFormActionsProps) {
  const { t } = useTranslation();

  return (
    <StyledActions square elevation={0}>
      {onSave && (
        <Button
          disabled={isLoading}
          onClick={onSave}
          variant="contained"
          color="secondary"
        >
          {t('onboarding:actions.save')}
        </Button>
      )}
      <StyledRightBlock>
        {onSubmit ? (
          <Button
            disabled={isLoading}
            onClick={onSubmit}
            variant="contained"
            color="primary"
          >
            {t(`onboarding:actions.submit`)}
          </Button>
        ) : (
          <Button
            disabled={isLoading}
            type={'submit'}
            variant="contained"
            color="primary"
          >
            {t(`onboarding:actions.next`)}
          </Button>
        )}
      </StyledRightBlock>
    </StyledActions>
  );
}
