import { useGetFinanceOffers } from '@/core/queries/useFinancing';
import { Box, CircularProgress } from '@mui/material';

import { FinanceLimits } from './FinanceLimits';
import { FinanceOffers } from './FinanceOffers';

export const FinanceWidget = () => {
  const { isLoading, data } = useGetFinanceOffers();

  if (isLoading) {
    return <CircularProgress color="inherit" size={20} />;
  }

  if (!data?.offers || data.offers.length === 0) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
      {/* Limit */}
      <Box sx={{ flex: '1 1 0%', maxWidth: '496px', width: '100%' }}>
        <FinanceLimits isLoading={isLoading} offers={data?.offers} />
      </Box>
      {/* Current offer */}
      <Box
        sx={{
          width: '542px',
        }}
      >
        <FinanceOffers isLoading={isLoading} offers={data?.offers} />
      </Box>
    </Box>
  );
};
