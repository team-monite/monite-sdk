import {
  StyledFooter,
  StyledText,
  StyledList,
  StyledFooterWrapper,
} from './OnboardingFooter.styled';
import { MoniteLogo } from '@/components/onboarding/components/MoniteLogo';
import { OnboardingContainer } from '@/components/onboarding/components/OnboardingContainer/OnboardingContainer';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { Button } from '@/ui/components/button';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

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
              <Button 
                variant="link" 
                asChild
                className="mtw:h-auto mtw:p-0 mtw:text-sm mtw:text-muted-foreground mtw:flex"
              >
                <a
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
                </a>
              </Button>
            ) : (
              <Button 
                variant="link" 
                asChild
                className="mtw:h-auto mtw:p-0 mtw:text-sm mtw:text-muted-foreground mtw:flex"
              >
                <a
                  href={DEFAULT_WEBSITE_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MoniteLogo />
                </a>
              </Button>
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
