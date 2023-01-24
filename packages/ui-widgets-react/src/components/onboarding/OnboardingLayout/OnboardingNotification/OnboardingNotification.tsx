import React from 'react';
import { styled } from '@mui/material';
import { palette, UAngleRight, UShieldCheck } from '@team-monite/ui-kit-react';
import { useTranslation } from 'react-i18next';

const StyledNotification = styled('a')`
  background-color: ${palette.warning95};
  color: ${palette.warning30};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 12px;
  gap: 10px;
  transition: border-color 0.2s ease-in-out;
  border: 1px solid ${palette.warning95};

  &:hover {
    border-color: ${palette.warning30};
  }

  ${({ theme }) => theme.breakpoints.up('sm')} {
    border-radius: 8px;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    gap: 13px;
  }
`;

const StyledNotificationText = styled('span')`
  width: 100%;
  color: ${palette.warning30};
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
`;

export default function OnboardingNotification() {
  const { t } = useTranslation();

  return (
    <StyledNotification href={'#'}>
      <UShieldCheck width={22} />
      <StyledNotificationText>
        {t('onboarding:notification')}
      </StyledNotificationText>
      <UAngleRight width={22} />
    </StyledNotification>
  );
}
