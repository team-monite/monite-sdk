import React from 'react';
import { Box, styled, Tooltip, Link } from '@mui/material';
import { palette, UAngleRight, UShieldCheck } from '@team-monite/ui-kit-react';
import { useTranslation } from 'react-i18next';

const StyledNotification = styled(Box)`
  background-color: ${palette.warning95};
  color: ${palette.warning30};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  padding: 12px;
  gap: 10px;
  cursor: default;
  transition: border-color 0.2s ease-in-out;
  border: 1px solid ${palette.warning95};

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
    <Tooltip
      arrow
      title={
        <>
          Monit powers online business for
          <br /> millions of companies around
          <br /> the world.&nbsp;
          <Link
            target={'_blank'}
            rel="noopener noreferrer"
            color={palette.neutral100}
            href={'#'}
          >
            Learn more
          </Link>
        </>
      }
    >
      <StyledNotification>
        <UShieldCheck width={22} />
        <StyledNotificationText>
          {t('onboarding:notification')}
        </StyledNotificationText>
        <UAngleRight width={22} />
      </StyledNotification>
    </Tooltip>
  );
}
