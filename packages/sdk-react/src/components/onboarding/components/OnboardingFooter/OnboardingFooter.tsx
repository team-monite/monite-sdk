import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Link,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

import { MoniteLogo, OnboardingContainer } from '../../components';

const StyledFooter = styled(Box)`
  padding: ${({ theme }) => theme.spacing(2)};

  ${({ theme }) => theme.breakpoints.up('lg')} {
    padding: ${({ theme }) => theme.spacing(4)};
    position: absolute;
    bottom: 0;
  }
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 14px;
  line-height: 20px;
`;

const StyledText = styled(Box)`
  color: ${({ theme }) => theme.palette.text.secondary};
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

const StyledFooterWrapper = styled('div')`
  margin-top: auto;
`;

function OnboardingFooterContent() {
  const { i18n } = useLingui();
  return (
    <StyledFooter>
      <StyledList>
        <li>
          <StyledLink
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
            href="https://monite.com/terms/"
          >
            <Typography variant="body2">{t(i18n)`Terms`}</Typography>
          </StyledLink>
        </li>
        <li>
          <StyledLink
            underline="hover"
            target="_blank"
            rel="noopener noreferrer"
            href="https://monite.com/data-privacy/"
          >
            <Typography variant="body2">{t(i18n)`Privacy`}</Typography>
          </StyledLink>
        </li>
        <li>
          <StyledText>
            <Typography variant="body2">{t(i18n)`Powered by`}</Typography>
            <StyledLink
              href="https://monite.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <MoniteLogo />
            </StyledLink>
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
