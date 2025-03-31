import { components } from '@/api';
import { Box } from '@mui/material';

import { FinanceLimits } from './FinanceLimits';
import { FinanceOffers } from './FinanceOffers';

type FinanceWidgetProps = {
  offers: components['schemas']['FinancingOffer'][];
};

export const FinanceWidget = ({ offers }: FinanceWidgetProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 4 }}>
      {/* Limit */}
      <Box sx={{ width: '100%' }}>
        <FinanceLimits offers={offers} />
      </Box>

      {offers?.[0]?.status === 'CURRENT' && (
        <Box sx={{ width: '100%' }}>
          <FinanceOffers offers={offers} />
        </Box>
      )}
    </Box>
  );
};
