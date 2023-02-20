import React from 'react';
import { Link, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';
import { Trans } from 'react-i18next';

const StyledAgreement = styled('span')`
  color: ${palette.neutral50};
  font-size: 14px;
  line-height: 18px;
`;

export default function OnboardingAgreement() {
  return (
    <StyledAgreement>
      <Trans
        i18nKey="onboarding:bankAccountStep.agreement"
        components={{
          link1: (
            <Link
              underline={'hover'}
              target={'_blank'}
              rel="noopener noreferrer"
              href={'https://monite.com/data-privacy/'}
            />
          ),
        }}
      />
    </StyledAgreement>
  );
}
