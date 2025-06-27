import { components } from '@/api';
import { FinanceBannerWrapper } from '@/components/financing/components/FinanceBannerWrapper';
import { FinanceMenuButtons } from '@/components/financing/components/FinanceMenuButtons';
import { FinanceProgressBar } from '@/components/financing/components/FinanceProgressBar';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, useTheme } from '@mui/material';

export const FinanceLimits = ({
  offers = [],
}: {
  offers?: components['schemas']['FinancingOffer'][];
}) => {
  const { componentSettings } = useMoniteContext();
  const { i18n } = useLingui();
  const theme = useTheme();
  const { formatCurrencyToDisplay } = useCurrencies();
  const totalLimit = offers?.[0]?.total_amount ?? 0;
  const remainingLimit =
    (offers?.[0]?.status === 'LATE' ? 0 : offers?.[0]?.available_amount) ?? 0;
  const progress = (remainingLimit / totalLimit) * 100;
  const isAvailable =
    offers?.[0]?.status !== 'CLOSED' && offers?.[0]?.status !== 'DEFAULTED';

  const handleWidgetText = () => {
    switch (offers?.[0]?.status) {
      case 'DEFAULTED':
        return t(
          i18n
        )`Financing is blocked due to a violation of the agreed-upon terms. Please, contact the provider for further details.`;
      case 'CLOSED':
        return t(
          i18n
        )`Financing is not available for your business anymore. Please, contact the provider for further details.`;
      case 'LATE':
        return t(
          i18n
        )`Due to late payment your financing is currently on hold. Please, contact the provider for further details.`;
      default:
        return t(i18n)`
        Your amount available for financing additional invoices.
      `;
    }
  };

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <Box maxWidth="440px" width="100%">
      <Typography
        variant="subtitle1"
        sx={{ mb: 3, display: 'inline-block' }}
      >{t(i18n)`My financing`}</Typography>

      <FinanceBannerWrapper>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1.25,
          }}
        >
          <Box>
            {isAvailable ? (
              <>
                <Typography variant="body1">{t(
                  i18n
                )`Remaining limit`}</Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h2" fontSize={24} lineHeight="32px">
                    {formatCurrencyToDisplay(remainingLimit, 'USD')}
                  </Typography>
                  <Typography
                    component="span"
                    variant="subtitle1"
                    fontSize={18}
                    color={theme.palette.grey[400]}
                  >
                    / {formatCurrencyToDisplay(totalLimit, 'USD')}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="h2" fontSize={24}>{t(
                i18n
              )`Not available`}</Typography>
            )}
          </Box>

          <Box display="flex" flexDirection="column" gap={1.5}>
            {isAvailable && <FinanceProgressBar progress={progress} />}

            <Typography
              variant="body1"
              fontSize={14}
              lineHeight="22px"
              fontWeight={400}
            >
              {handleWidgetText()}
            </Typography>
          </Box>

          {componentSettings?.financing?.enableFinanceWidgetButton && (
            <FinanceMenuButtons />
          )}
        </Box>
      </FinanceBannerWrapper>
    </Box>
  );
};
