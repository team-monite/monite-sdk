import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

import { CustomerSection } from '../CustomerSection';
import { SectionGeneralProps } from '../Section.types';
import { FullfillmentSummary } from './Billing/FullfillmentSummary';
import { YourVatDetailsForm } from './Billing/YourVatDetailsForm';

export const BillToSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}>
      <Box sx={{ width: '100%', maxWidth: '400px' }}>
        <Typography sx={{ mb: 2 }} variant="subtitle1">{t(
          i18n
        )`Bill to`}</Typography>
        <CustomerSection disabled={disabled} />
      </Box>
      <Box sx={{ width: '100%', maxWidth: '400px' }}>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ mb: 2 }} variant="subtitle1">{t(
            i18n
          )`Details`}</Typography>
          <YourVatDetailsForm disabled={disabled} />
        </Box>
        <FullfillmentSummary disabled={disabled} />
      </Box>
    </Box>
  );
};
