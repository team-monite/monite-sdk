import { useState } from 'react';

import {
  FinanceBannerPlaceholder,
  FinanceFaqWrapper,
} from '@/components/financing/components';
import { useCurrencies } from '@/core/hooks';
import {
  ApplicationState,
  useFinancing,
  startFinanceSession,
} from '@/core/queries/useFinancing';
import { useTheme } from '@emotion/react';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Money } from '@mui/icons-material';
import { Box, Button, lighten, Stack, Typography } from '@mui/material';

const LOCAL_STORAGE_KEY = 'financing_banner_hidden';
const SEVEN_DAYS_TIME_MILLISECONDS = 7 * 24 * 60 * 60 + 1000;

type StorageBannerState = {
  isHidden: boolean;
  expires_at: number;
};

type FinanceBannerProps = {
  /** Defines the banner style */
  variant?: 'finance' | 'onboard' | 'finance_card';
  /** Enables servicing banner variant */
  enableServicingBanner?: boolean;
};

export const FinanceBanner = ({
  variant = 'onboard',
  enableServicingBanner = false,
}: FinanceBannerProps) => {
  const { i18n } = useLingui();
  const theme = useTheme();
  const { formatCurrencyToDisplay } = useCurrencies();
  const {
    buttonText,
    isLoading,
    isEnabled,
    applicationState,
    isServicing,
    offer,
  } = useFinancing();
  const totalLimit = offer?.total_amount ?? 0;
  const remainingLimit = offer?.available_amount ?? 0;
  const progress = (remainingLimit / totalLimit) * 100;

  const [isHidden, setIsHidden] = useState(() => {
    const sessionStorageBannerState: StorageBannerState = JSON.parse(
      JSON.parse(JSON.stringify(sessionStorage.getItem(LOCAL_STORAGE_KEY)))
    );
    const localStorageBannerState: StorageBannerState = JSON.parse(
      JSON.parse(JSON.stringify(localStorage.getItem(LOCAL_STORAGE_KEY)))
    );

    if (sessionStorageBannerState) {
      return sessionStorageBannerState.isHidden;
    }

    if (localStorageBannerState) {
      if (!localStorageBannerState.expires_at) {
        return localStorageBannerState.isHidden;
      }

      const date = new Date().getTime();

      if (date > localStorageBannerState.expires_at) {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return false;
      }

      return localStorageBannerState.isHidden;
    }

    return false;
  });

  const shouldApplyFinanceStyles = enableServicingBanner && isServicing;
  const isCustomBanner =
    applicationState !== ApplicationState.PENDING_APPROVAL &&
    applicationState !== ApplicationState.NO_OFFERS_AVAILABLE;

  const handleHide = () => {
    setIsHidden(true);

    switch (applicationState) {
      case ApplicationState.IN_PROGRESS:
      case ApplicationState.APPROVED:
      case ApplicationState.PENDING_APPROVAL:
      case ApplicationState.OFFER_ACCEPTED:
        sessionStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            isHidden: true,
            expires_at: null,
          })
        );
        return;
      case ApplicationState.INIT:
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            isHidden: true,
            expires_at: new Date().getTime() + SEVEN_DAYS_TIME_MILLISECONDS,
          })
        );
        return;
      case ApplicationState.NO_OFFERS_AVAILABLE:
      case ApplicationState.OFFERS_EXPIRED:
      default:
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            isHidden: true,
            expires_at: null,
          })
        );
        return;
    }
  };

  const handleBannerIcon = () => {
    switch (applicationState) {
      case ApplicationState.INIT:
      case ApplicationState.IN_PROGRESS:
      case ApplicationState.APPROVED:
      default:
        return {
          wrapper: lighten(theme.palette.primary.main, 0.6),
          icon: '#FFF',
        };
      case ApplicationState.PENDING_APPROVAL:
        return {
          wrapper: '#F4F4FE',
          icon: theme.palette.primary.main,
        };
      case ApplicationState.NO_OFFERS_AVAILABLE:
      case ApplicationState.OFFERS_EXPIRED:
        return {
          wrapper: 'rgba(255,71,93,0.4)',
          icon: '#FFF',
        };
    }
  };

  const iconColors = handleBannerIcon();

  const handleBannerTextContent = () => {
    switch (applicationState) {
      case ApplicationState.INIT:
      case ApplicationState.IN_PROGRESS:
      default:
        return (
          <>
            <Typography variant="subtitle2" sx={{ fontSize: 20 }}>{t(
              i18n
            )`Fund your sales/purchases`}</Typography>
            <Typography variant="body1">
              {t(
                i18n
              )`Get a small business loan plan to manage finances more efficiently.`}{' '}
              <FinanceFaqWrapper>
                {({ openModal }) => (
                  <Typography
                    onClick={openModal}
                    variant="body1"
                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                    component="span"
                  >{t(i18n)`Read more >`}</Typography>
                )}
              </FinanceFaqWrapper>
            </Typography>
          </>
        );
      case ApplicationState.PENDING_APPROVAL:
        return (
          <>
            <Typography variant="subtitle2" sx={{ fontSize: 20 }}>{t(
              i18n
            )`Your application is in review`}</Typography>
            <Typography variant="body1">
              {t(
                i18n
              )`It can take up to 48 hours. We'll notify you about the results.`}
            </Typography>
          </>
        );
      case ApplicationState.APPROVED:
        return (
          <>
            <Typography variant="subtitle2" sx={{ fontSize: 20 }}>{t(
              i18n
            )`Your application was approved`}</Typography>
            <Typography variant="body1">
              {t(
                i18n
              )`Please, review the offered credit limit and approved financing plans.`}
            </Typography>
          </>
        );
      case ApplicationState.NO_OFFERS_AVAILABLE:
        return (
          <>
            <Typography variant="subtitle2" sx={{ fontSize: 20 }}>{t(
              i18n
            )`A provider can't offer you financing`}</Typography>
            <Typography variant="body1">
              {t(
                i18n
              )`They will contact you if your credit score improves and you can reapply.`}
            </Typography>
          </>
        );
      case ApplicationState.OFFERS_EXPIRED:
        return (
          <>
            <Typography variant="subtitle2" sx={{ fontSize: 20 }}>{t(
              i18n
            )`You haven't accepted the offer and it has expired`}</Typography>
            <Typography variant="body1">
              {t(
                i18n
              )`Please get in touch with the provider if you still wish to receive financing.`}
            </Typography>
          </>
        );
      case ApplicationState.SERVICING:
        return (
          <Typography variant="subtitle2" sx={{ fontSize: 20 }}>{t(
            i18n
          )`My financing`}</Typography>
        );
    }
  };

  if (
    isHidden ||
    (applicationState === ApplicationState.SERVICING && !enableServicingBanner)
  ) {
    return null;
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <FinanceBannerPlaceholder
      shouldDisplayCustomBg={isCustomBanner}
      variant={variant}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 2,
          zIndex: 10,
          position: 'relative',
          width: '100%',
          height: shouldApplyFinanceStyles ? 'auto' : '100%',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flex: '1 1 0%',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              backgroundColor: iconColors.wrapper,
              borderRadius: '10px',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Money
              sx={{
                color: iconColors.icon,
                width: 20,
                height: 20,
              }}
            />
          </Box>
          <Box sx={{ flex: '1 1 0%' }}>{handleBannerTextContent()}</Box>
        </Box>
        <Stack direction="row" gap={1} alignItems="center">
          {shouldApplyFinanceStyles ? (
            <Button
              onClick={handleHide}
              variant="text"
              sx={{ color: '#292929' }}
            >
              {t(i18n)`View details`}
            </Button>
          ) : (
            <Button
              onClick={handleHide}
              variant="text"
              {...(isCustomBanner && {
                sx: { color: '#292929' },
              })}
            >
              {isCustomBanner ? t(i18n)`Hide` : t(i18n)`Close`}
            </Button>
          )}

          {isCustomBanner && (
            <Button
              disabled={isLoading}
              onClick={() => {
                if (isLoading) return;
                startFinanceSession();
              }}
              variant="outlined"
              sx={{
                bgcolor: 'black',
                px: 2.5,
                py: 1.5,
                color: 'white',
                minWidth: 185,
                height: 40,
                borderRadius: '8px',
              }}
            >
              {buttonText || t(i18n)`Apply for financing`}
            </Button>
          )}
        </Stack>
      </Box>

      {shouldApplyFinanceStyles && (
        <Box mt={1} pl="56px" zIndex={10} position="relative">
          <Typography variant="body1">{t(i18n)`Remaining limit`}</Typography>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h2" fontSize={32}>
                {formatCurrencyToDisplay(remainingLimit, 'USD')}
              </Typography>
              <Typography
                component="span"
                variant="subtitle1"
                sx={{ color: '#B8B8B8' }}
              >
                / {formatCurrencyToDisplay(totalLimit, 'USD')}
              </Typography>
            </Box>
            <Typography variant="body1">
              {offer?.pricing_plans?.length} {t(i18n)`financial plans enabled`}
            </Typography>
          </Box>

          <Box
            sx={{
              backgroundColor: '#EBEBFF',
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              mt: 1,
            }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(153, 153, 255, 1)',
                width: `${progress}%`,
                height: '6px',
                borderRadius: '3px',
              }}
            />
          </Box>
        </Box>
      )}
    </FinanceBannerPlaceholder>
  );
};
