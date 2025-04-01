import { useState } from 'react';

import { components } from '@/api';
import { Dialog } from '@/components/Dialog';
import {
  FinanceBannerPlaceholder,
  FinanceHowItWorks,
} from '@/components/financing/components';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography, Stack, Button } from '@mui/material';

export const FinanceLimits = ({
  offers = [],
}: {
  offers?: components['schemas']['FinancingOffer'][];
}) => {
  const { i18n } = useLingui();
  const { startFinanceSession } = useKanmonContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        Your remaining limit is the amount available to you for financing additional invoices
      `;
    }
  };

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <Box maxWidth="542px" width="100%">
      <Typography
        variant="subtitle1"
        sx={{ mb: 2, display: 'inline-block' }}
      >{t(i18n)`My financing`}</Typography>

      <FinanceBannerPlaceholder shouldDisplayCustomBg variant="finance_card">
        <Box
          sx={{
            gap: 3,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box>
            {isAvailable ? (
              <>
                <Typography variant="body1">{t(
                  i18n
                )`Remaining limit`}</Typography>
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
              </>
            ) : (
              <Typography variant="h2" fontSize={32}>{t(
                i18n
              )`Not available`}</Typography>
            )}
          </Box>
          {/* Progress bar */}
          <Box>
            {isAvailable && (
              <Box
                sx={{
                  backgroundColor: 'white',
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
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
            )}
            <Typography
              variant="body1"
              mt={1.5}
              sx={{ color: 'rgba(0,0,0,0.56)', fontWeight: 400 }}
            >
              {handleWidgetText()}
            </Typography>
          </Box>

          <Stack direction="row" gap={1} alignItems="center">
            <Button
              onClick={() => startFinanceSession()}
              variant="outlined"
              sx={{
                bgcolor: 'black',
                px: 2.5,
                py: 1.5,
                color: 'white',
                height: 40,
                borderRadius: '8px',
                borderColor: 'black',
              }}
            >
              {t(i18n)`Financing menu`}
            </Button>

            <Button
              variant="text"
              onClick={() => setIsDialogOpen(true)}
              sx={{ color: '#292929', px: 2.5, py: 1.5, height: 40 }}
            >
              {t(i18n)`How it works?`}
            </Button>
          </Stack>
        </Box>
      </FinanceBannerPlaceholder>

      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        alignDialog="right"
      >
        <FinanceHowItWorks />
      </Dialog>
    </Box>
  );
};
