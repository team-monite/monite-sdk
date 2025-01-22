import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

import { CustomerSection } from '../CustomerSection';
import { SectionGeneralProps } from '../Section.types';

export const BillToSection = ({ disabled }: SectionGeneralProps) => {
  const { i18n } = useLingui();
  return (
    <Box mb={6}>
      <Box sx={{ width: '100%', maxWidth: '960px' }}>
        <Typography sx={{ mb: 2 }} variant="h3">{t(
          i18n
        )`Create invoice`}</Typography>
        <CustomerSection disabled={disabled} />
      </Box>
    </Box>
  );
};
