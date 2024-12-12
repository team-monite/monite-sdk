import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, CircularProgress, Typography } from '@mui/material';

import { FinanceCardStack } from '../../../infographics/FinanceCardStack';

export const FinanceLimits = ({
  isLoading = false,
  offers = [],
}: {
  isLoading?: boolean;
  offers?: components['schemas']['FinancingOffer'][];
}) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();
  const totalLimit = offers?.[0]?.total_amount ?? 0;
  const remainingLimit = offers?.[0]?.available_amount ?? 0;
  const progress = (remainingLimit / totalLimit) * 100;

  if (isLoading) {
    return <CircularProgress color="inherit" size={20} />;
  }

  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="subtitle1">{t(i18n)`My financing`}</Typography>
      <Box
        sx={{
          mt: 2,
          borderRadius: 3,
          backgroundColor: 'rgba(205, 201, 255, 1)',
          p: 4,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <FinanceCardStack
          sx={{
            position: 'absolute',
            width: '360px',
            height: '206px',
            bottom: 0,
            right: 0,
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            gap: 4,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box>
            <Typography variant="body1" mt={1}>
              {t(i18n)`Remaining limit`}
            </Typography>
            <Typography variant="h2">
              {formatCurrencyToDisplay(remainingLimit ?? 0, 'USD')}{' '}
              <Typography
                component="span"
                variant="subtitle1"
                sx={{ color: 'white' }}
              >
                / {formatCurrencyToDisplay(totalLimit ?? 0, 'USD')}
              </Typography>
            </Typography>
          </Box>
          {/* Progress bar */}
          <Box>
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
              ></Box>
            </Box>
            <Typography variant="body1" mt={4}>
              {t(i18n)`
              Your remaining limit is the amount available to you for financing additional invoices
            `}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
