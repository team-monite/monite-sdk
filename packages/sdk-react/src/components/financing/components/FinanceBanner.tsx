import { useState } from 'react';

import {
  FinanceBannerPlaceholder,
  FinanceFaqWrapper,
} from '@/components/financing/components';
import {
  FinancialApplicationState,
  useFinancing,
} from '@/components/financing/hooks';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { useCurrencies } from '@/core/hooks';
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
  /** Defines the banner style.
    `onboard` has a `height of 90px`, it is set to be used as an actual banner.
    `finance` has a `height of 192px`, it is also set to be used as a banner but only when you are already part of a financing plan.
    `finance_card` has a `height of 280px`, it is supposed to be used as a card.
    It is also worth noting that their widths are all 100%, so what defines the width of the banner is the wrapping container.
  */
  variant?: 'finance' | 'onboard' | 'finance_card';
  /** `enableServicingBanner` is a boolean flag that enables the `FinanceBanner` to be a small summarized version of the financing tab, but only works when entity is onboarded and is servicing. */
  enableServicingBanner?: boolean;
  /** Function that is called when clicking on View Details button.
   * The button will only appear when entity is servicing, enableServicingBanner is true and handleViewDetails is passed.
   * The purpose of this button is to give the user a way to navigate to the financing page through it. */
  handleViewDetails?: () => void;
};

export const FinanceBanner = ({
  variant = 'onboard',
  enableServicingBanner = false,
  handleViewDetails,
}: FinanceBannerProps) => {
  const { i18n } = useLingui();
  const { startFinanceSession } = useKanmonContext();
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
  const remainingLimit =
    (offer?.status === 'LATE' ? 0 : offer?.available_amount) ?? 0;
  const progress = (remainingLimit / totalLimit) * 100;
  const isAvailable =
    offer?.status !== 'CLOSED' && offer?.status !== 'DEFAULTED';

  const [isHidden, setIsHidden] = useState(() => {
    const sessionStorageBannerState: StorageBannerState = JSON.parse(
      JSON.parse(JSON.stringify(sessionStorage.getItem(LOCAL_STORAGE_KEY)))
    );

    if (sessionStorageBannerState) {
      return sessionStorageBannerState.isHidden;
    }

    const localStorageBannerState: StorageBannerState = JSON.parse(
      JSON.parse(JSON.stringify(localStorage.getItem(LOCAL_STORAGE_KEY)))
    );

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
    applicationState !== FinancialApplicationState.PENDING_APPROVAL &&
    applicationState !== FinancialApplicationState.NO_OFFERS_AVAILABLE;

  const handleHide = () => {
    setIsHidden(true);

    switch (applicationState) {
      case FinancialApplicationState.IN_PROGRESS:
      case FinancialApplicationState.APPROVED:
      case FinancialApplicationState.PENDING_APPROVAL:
      case FinancialApplicationState.OFFER_ACCEPTED:
        sessionStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            isHidden: true,
            expires_at: null,
          })
        );
        return;
      case FinancialApplicationState.INIT:
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify({
            isHidden: true,
            expires_at: new Date().getTime() + SEVEN_DAYS_TIME_MILLISECONDS,
          })
        );
        return;
      case FinancialApplicationState.NO_OFFERS_AVAILABLE:
      case FinancialApplicationState.OFFERS_EXPIRED:
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
      case FinancialApplicationState.INIT:
      case FinancialApplicationState.IN_PROGRESS:
      case FinancialApplicationState.APPROVED:
      default:
        return {
          wrapper: lighten(theme.palette.primary.main, 0.6),
          icon: '#FFF',
        };
      case FinancialApplicationState.PENDING_APPROVAL:
        return {
          wrapper: '#F4F4FE',
          icon: theme.palette.primary.main,
        };
      case FinancialApplicationState.NO_OFFERS_AVAILABLE:
      case FinancialApplicationState.OFFERS_EXPIRED:
        return {
          wrapper: 'rgba(255,71,93,0.4)',
          icon: '#FFF',
        };
    }
  };

  const iconColors = handleBannerIcon();

  const handleBannerTextContent = () => {
    switch (applicationState) {
      case FinancialApplicationState.INIT:
      case FinancialApplicationState.IN_PROGRESS:
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
      case FinancialApplicationState.PENDING_APPROVAL:
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
      case FinancialApplicationState.APPROVED:
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
      case FinancialApplicationState.NO_OFFERS_AVAILABLE:
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
      case FinancialApplicationState.OFFERS_EXPIRED:
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
      case FinancialApplicationState.SERVICING:
        return (
          <Typography variant="subtitle2" sx={{ fontSize: 20 }}>{t(
            i18n
          )`My financing`}</Typography>
        );
    }
  };

  if (
    isHidden ||
    (applicationState === FinancialApplicationState.SERVICING &&
      !enableServicingBanner)
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
          {shouldApplyFinanceStyles && handleViewDetails ? (
            <Button
              onClick={handleViewDetails}
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
          {isAvailable ? (
            <>
              <Typography variant="body1">{t(
                i18n
              )`Remaining limit`}</Typography>

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
                  {offer?.pricing_plans?.length}{' '}
                  {t(i18n)`financial plans enabled`}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="h2" fontSize={32}>
              {t(i18n)`Not available`}
            </Typography>
          )}

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

          {(!isAvailable || offer?.status === 'LATE') && (
            <Typography variant="body1" fontWeight={400} mt={1}>
              {offer?.status === 'CLOSED' &&
                t(
                  i18n
                )`Financing is not available for your business anymore. Please, contact the provider for further details.`}
              {offer?.status === 'DEFAULTED' &&
                t(
                  i18n
                )`Financing is blocked due to a violation of the agreed-upon terms. Please, contact the provider for further details.`}
              {offer?.status === 'LATE' &&
                t(
                  i18n
                )`Due to late payment your financing is currently on hold. Please, contact the provider for further details.`}
            </Typography>
          )}
        </Box>
      )}
    </FinanceBannerPlaceholder>
  );
};
