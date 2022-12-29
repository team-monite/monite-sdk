import React from 'react';
import { Box, Link, styled } from '@mui/material';
import { palette } from '@team-monite/ui-kit-react';
import { useTranslation } from 'react-i18next';

const StyledFooter = styled(Box)`
  background-color: ${palette.neutral90};
  padding: ${({ theme }) => theme.spacing(2, 2, 14)};

  ${({ theme }) => theme.breakpoints.up('sm')} {
    padding: ${({ theme }) => theme.spacing(4)};
    bottom: 0;
    left: 0;
    position: fixed;
    padding-bottom: 0;
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
`;

const StyledList = styled('ul')`
  padding: 0;
  margin: 0;
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export default function OnboardingFooter() {
  const { t } = useTranslation();

  return (
    <StyledFooter>
      <StyledList>
        <li>
          <StyledLink underline={'hover'} href={'#'}>
            {t('onboarding:footer.terms')}
          </StyledLink>
        </li>
        <li>
          <StyledLink underline={'hover'} href={'#'}>
            {t('onboarding:footer.privacy')}
          </StyledLink>
        </li>
        <li>
          <StyledText>{t('onboarding:footer.english')}</StyledText>
        </li>
        <li>
          <StyledText>{t('onboarding:footer.monite')}</StyledText>
        </li>
      </StyledList>
    </StyledFooter>
  );
}
