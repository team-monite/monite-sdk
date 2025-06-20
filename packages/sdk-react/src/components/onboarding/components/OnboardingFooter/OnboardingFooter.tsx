import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

import { MoniteLogo } from '../../components/MoniteLogo';
import { OnboardingContainer } from '../../components/OnboardingContainer';
import {
  StyledFooter,
  StyledLink,
  StyledText,
  StyledList,
  StyledFooterWrapper,
} from './OnboardingFooter.styled';

const DEFAULT_WEBSITE_URL = 'https://monite.com/';

function OnboardingFooterContent() {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

  const customLogoUrl = componentSettings?.onboarding?.footerLogoUrl;
  const customWebsiteUrl = componentSettings?.onboarding?.footerWebsiteUrl;

  return (
    <StyledFooter>
      <StyledList>
        <li>
          <StyledText>
            <Typography variant="body2">{t(i18n)`Powered by`}</Typography>
            {customLogoUrl && customWebsiteUrl ? (
              <StyledLink
                href={customWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Box
                  component="img"
                  src={customLogoUrl}
                  alt={customWebsiteUrl}
                  sx={{ width: 'auto', height: '1rem' }}
                />
              </StyledLink>
            ) : (
              <StyledLink
                href={DEFAULT_WEBSITE_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <MoniteLogo />
              </StyledLink>
            )}
          </StyledText>
        </li>
      </StyledList>
    </StyledFooter>
  );
}

export function OnboardingFooter() {
  const theme = useTheme();
  const moreThanLG = useMediaQuery(theme.breakpoints.up('lg'));
  const { componentSettings } = useMoniteContext();

  if (componentSettings?.onboarding?.hideFooter) {
    return null;
  }

  if (moreThanLG) {
    return (
      <StyledFooterWrapper>
        <OnboardingFooterContent />
      </StyledFooterWrapper>
    );
  }

  return (
    <StyledFooterWrapper>
      <OnboardingContainer>
        <OnboardingFooterContent />
      </OnboardingContainer>
    </StyledFooterWrapper>
  );
}
