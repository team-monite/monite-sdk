import { useOnboardingPaymentTheme } from '@/core/queries/useOnboardingPaymentTheme';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Skeleton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { MoniteLogo, OnboardingContainer } from '../../components';
import {
  StyledFooter,
  StyledLink,
  StyledText,
  StyledList,
  StyledFooterWrapper,
} from './OnboardingFooter.styled';

function OnboardingFooterContent() {
  const { i18n } = useLingui();
  const { data: themeData, isLoading } = useOnboardingPaymentTheme();

  const customLogoUrl = themeData?.footer?.logo_url;
  const customWebsiteUrl = themeData?.footer?.website_url;

  if (isLoading) {
    return (
      <StyledFooter>
        <StyledList>
          <li>
            <StyledText>
              <Skeleton variant="rectangular" width={100} height={24} />
            </StyledText>
          </li>
        </StyledList>
      </StyledFooter>
    );
  }

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
                href="https://monite.com/"
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
