import { useState } from 'react';

import { FinanceBannerWrapper } from './FinanceBannerWrapper';
import { FinanceFaqWrapper } from './FinanceFaqWrapper';
import { FinanceProgressBar } from './FinanceProgressBar';
import {
  FinancialApplicationState,
  useFinancing,
} from '@/components/financing/hooks';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const LOCAL_STORAGE_KEY = 'financing_banner_hidden';
const SEVEN_DAYS_TIME_MILLISECONDS = 7 * 24 * 60 * 60 + 1000;

type StorageBannerState = {
  isHidden: boolean;
  expires_at: number;
};

export const FinanceBanner = (props: FinanceBannerProps) => (
  <MoniteScopedProviders>
    <FinanceBannerBase {...props} />
  </MoniteScopedProviders>
);

type FinanceBannerProps = {
  /** `enableServicingBanner` is a boolean flag that enables the `FinanceBanner` to be a small summarized version of the financing tab, but only works when entity is onboarded and is servicing. */
  enableServicingBanner?: boolean;
  /** Function that is called when clicking on View Details button.
   * The button will only appear when entity is servicing, enableServicingBanner is true and handleViewDetails is passed.
   * The purpose of this button is to give the user a way to navigate to the financing page through it. */
  handleViewDetails?: () => void;
};

const FinanceBannerBase = ({
  enableServicingBanner = false,
  handleViewDetails,
}: FinanceBannerProps) => {
  const { i18n } = useLingui();
  const { startFinanceSession } = useKanmonContext();
  const theme = useTheme();
  const isLowerThanLargeScreen = useMediaQuery(theme.breakpoints.down('lg'));
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
    applicationState !== FinancialApplicationState.NO_OFFERS_AVAILABLE &&
    applicationState !== FinancialApplicationState.OFFERS_EXPIRED;

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
      case FinancialApplicationState.OFFER_ACCEPTED:
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
            )`A provider can’t offer you financing`}</Typography>
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
            )`You haven’t accepted the offer and it has expired`}</Typography>
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
    <FinanceBannerWrapper shouldApplyFinanceStyles={shouldApplyFinanceStyles}>
      <Box
        display="flex"
        alignItems={
          isLowerThanLargeScreen && !shouldApplyFinanceStyles
            ? 'flex-end'
            : 'center'
        }
        flexDirection={
          isLowerThanLargeScreen && !shouldApplyFinanceStyles ? 'column' : 'row'
        }
        justifyContent="space-between"
        gap={2}
        width="100%"
        height="100%"
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            gap: 2,
            flex: '1 1 0%',
            alignItems:
              isLowerThanLargeScreen && !shouldApplyFinanceStyles
                ? 'flex-start'
                : 'center',
          }}
        >
          <Box sx={{ flex: '1 1 0%' }}>{handleBannerTextContent()}</Box>
        </Box>
        <Stack
          width={
            isLowerThanLargeScreen && !shouldApplyFinanceStyles
              ? '100%'
              : 'auto'
          }
          direction="row"
          gap={1}
          alignItems="center"
          justifyContent={
            isLowerThanLargeScreen && !shouldApplyFinanceStyles
              ? 'flex-end'
              : 'flex-start'
          }
        >
          {shouldApplyFinanceStyles && handleViewDetails ? (
            <Button onClick={handleViewDetails} variant="text">
              {t(i18n)`View details`}
            </Button>
          ) : (
            <Button onClick={handleHide} variant="text">
              {isCustomBanner ? t(i18n)`Hide` : t(i18n)`Close`}
            </Button>
          )}

          {isCustomBanner && buttonText && (
            <Button
              onClick={() => {
                startFinanceSession();
              }}
              disabled={isLoading}
              variant="contained"
              color="primary"
              sx={{
                px: 2.5,
                py: 1.5,
                height: 40,
              }}
            >
              {isLoading ? <CircularProgress size={20} /> : buttonText}
            </Button>
          )}
        </Stack>
      </Box>

      {shouldApplyFinanceStyles && (
        <Box>
          {isAvailable ? (
            <>
              <Typography variant="body1">{t(
                i18n
              )`Remaining limit`}</Typography>

              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap={1}
                mb={1}
              >
                <Box display="flex" alignItems="center" gap={1} flexShrink={0}>
                  <Typography variant="h2" fontSize={32}>
                    {formatCurrencyToDisplay(remainingLimit, 'USD')}
                  </Typography>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    sx={{ color: theme.palette.grey[400] }}
                  >
                    / {formatCurrencyToDisplay(totalLimit, 'USD')}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {offer?.pricing_plans?.length}{' '}
                  {t(i18n)`financial plans enabled`}
                </Typography>
              </Box>
            </>
          ) : (
            <Typography variant="h2" fontSize={32} mb={1}>
              {t(i18n)`Not available`}
            </Typography>
          )}

          <FinanceProgressBar progress={progress} />

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
    </FinanceBannerWrapper>
  );
};
