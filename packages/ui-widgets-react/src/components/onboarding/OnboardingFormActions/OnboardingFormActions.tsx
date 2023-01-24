import React from 'react';
import { Button, Paper, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { palette } from '@team-monite/ui-kit-react';

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
  }
`;

export default function OnboardingFormActions() {
  const { t } = useTranslation();

  return (
    <StyledActions square elevation={0}>
      <Button variant="contained" color="secondary">
        {t('onboarding:actions.save')}
      </Button>
      <Button type={'submit'} variant="contained" color="primary">
        {t('onboarding:actions.continue')}
      </Button>
    </StyledActions>
  );
}
