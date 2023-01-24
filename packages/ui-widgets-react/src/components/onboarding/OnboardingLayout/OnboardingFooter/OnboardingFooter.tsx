import React from 'react';
import { Box, Link, styled, useMediaQuery, useTheme } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';
import { useTranslation } from 'react-i18next';
import OnboardingContainer from '../OnboardingContainer';
import MoniteLogo from './MoniteLogo';

const StyledFooter = styled(Box)`
  background-color: ${palette.neutral90};
  padding: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up('lg')} {
    padding: ${({ theme }) => theme.spacing(4)};
  }
`;

const StyledLink = styled(Link)`
  color: ${palette.neutral50};
  font-size: 14px;
  line-height: 20px;
`;

const StyledText = styled(Box)`
  color: ${palette.neutral50};
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 3px;
`;

const StyledList = styled('ul')`
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 2px;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    flex-direction: row;
    justify-content: space-between;
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    flex-direction: column;
  }
`;

function OnboardingFooterContent() {
  const { t } = useTranslation();

  return (
    <StyledFooter>
      <StyledList>
        <li>
          <StyledLink
            underline={'hover'}
            target={'_blank'}
            href={'https://monite.com/terms/'}
          >
            {t('onboarding:footer.terms')}
          </StyledLink>
        </li>
        <li>
          <StyledLink
            underline={'hover'}
            target={'_blank'}
            href={'https://monite.com/data-privacy/'}
          >
            {t('onboarding:footer.privacy')}
          </StyledLink>
        </li>
        <li>
          <StyledText>{t('onboarding:footer.english')}</StyledText>
        </li>
        <li>
          <StyledText>
            {t('onboarding:footer.monite')}
            <Link href={'https://monite.com/'} target={'_blank'}>
              <MoniteLogo />
            </Link>
          </StyledText>
        </li>
      </StyledList>
    </StyledFooter>
  );
}

export default function OnboardingFooter() {
  const theme = useTheme();
  const moreThanLG = useMediaQuery(theme.breakpoints.up('lg'));

  if (moreThanLG) {
    return <OnboardingFooterContent />;
  }

  return (
    <OnboardingContainer>
      <OnboardingFooterContent />
    </OnboardingContainer>
  );
}
