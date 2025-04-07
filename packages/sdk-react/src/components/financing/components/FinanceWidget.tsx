import { components } from '@/api';
import { Box } from '@mui/material';

import { FinanceLimits } from './FinanceLimits';
import { FinanceOffers } from './FinanceOffers';

type FinanceWidgetProps = {
  offers: components['schemas']['FinancingOffer'][];
};

export const FinanceWidget = ({ offers }: FinanceWidgetProps) => {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <FinanceLimits offers={offers} />

      {offers?.[0]?.status === 'CURRENT' && <FinanceOffers offers={offers} />}
    </Box>
  );
};
