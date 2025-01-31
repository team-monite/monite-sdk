import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

import { CustomerSection } from '../CustomerSection';
import { SectionGeneralProps } from '../Section.types';

export interface BillToSectionProps extends SectionGeneralProps {
  counterpartVats:
    | {
        data: components['schemas']['CounterpartVatIDResponse'][];
      }
    | undefined;
  isCounterpartVatsLoading: boolean;
}

export const BillToSection = ({
  counterpartVats,
  isCounterpartVatsLoading,
  disabled,
}: BillToSectionProps) => {
  const { i18n } = useLingui();
  return (
    <Box mb={6}>
      <Box sx={{ width: '100%', maxWidth: '960px' }}>
        <Typography sx={{ mb: 5 }} variant="h3">{t(
          i18n
        )`Create invoice`}</Typography>
        <CustomerSection
          disabled={disabled}
          counterpartVats={counterpartVats}
          isCounterpartVatsLoading={isCounterpartVatsLoading}
        />
      </Box>
    </Box>
  );
};
