import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';
import { Box, Typography } from '@mui/material';

import { UpdatePDFModal } from './UpdatePDFModal';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
};

export const UpdatePDFSection = ({ invoice }: Props) => {
  const { i18n } = useLingui();

  if (invoice.status !== 'paid') {
    return null;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 4,
        p: 2,
        borderRadius: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
      }}
    >
      <Box
        sx={{
          flex: '1 1 0%',
        }}
      >
        <Typography variant="body1">{t(
          i18n
        )`Update PDF file with payment info`}</Typography>
        <Typography marginTop={1} variant="body2">{t(
          i18n
        )`A fully paid invoice can be updated to contain the amount paid and the amount due sum`}</Typography>
      </Box>
      <Box>
        <UpdatePDFModal invoice={invoice} />
      </Box>
    </Box>
  );
};
