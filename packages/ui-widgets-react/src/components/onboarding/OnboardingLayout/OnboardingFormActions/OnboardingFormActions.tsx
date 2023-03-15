import React from 'react';
import { Box, Button, Paper, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';
import { useTranslation } from 'react-i18next';
import { OnboardingSubmitAction } from '../../hooks/useOnboardingForm';

export type OnboardingFormActionsProps = {
  onSave?: () => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  /**
   * submitType is used to display the right label on the submit button
   */
  submitType: OnboardingSubmitAction;
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
  onCancel,
  onSubmit,
  submitType,
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
          {t('onboarding:actions.saveClose')}
        </Button>
      )}
      {onCancel && (
        <Button
          disabled={isLoading}
          onClick={onCancel}
          variant="contained"
          color="secondary"
        >
          {t(`onboarding:actions.cancel`)}
        </Button>
      )}
      <StyledRightBlock>
        <Button
          disabled={isLoading}
          type={submitType === 'submit' ? 'button' : 'submit'}
          variant="contained"
          color="primary"
          onClick={onSubmit}
        >
          {t(`onboarding:actions.${submitType}`)}
        </Button>
      </StyledRightBlock>
    </StyledActions>
  );
}
