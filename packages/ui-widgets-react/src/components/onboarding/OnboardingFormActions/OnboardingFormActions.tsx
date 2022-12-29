import React from 'react';
import { Button, Paper, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

const StyledActions = styled(Paper)`
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  justify-content: space-between;
  padding: 16px;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    position: relative;
    padding: 32px;
  }
`;

export default function OnboardingFormActions() {
  const { t } = useTranslation();

  return (
    <StyledActions elevation={0}>
      <Button variant="contained" color="secondary">
        {t('onboarding:actions.save')}
      </Button>
      <Button type={'submit'} variant="contained" color="primary">
        {t('onboarding:actions.continue')}
      </Button>
    </StyledActions>
  );
}
