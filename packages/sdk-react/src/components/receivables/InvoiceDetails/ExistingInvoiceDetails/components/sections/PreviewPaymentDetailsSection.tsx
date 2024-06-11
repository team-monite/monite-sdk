import React from 'react';

import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload } from '@monite/sdk-api';
import { Box, Typography } from '@mui/material';

interface PreviewPaymentDetailsSectionProps {
  invoice: InvoiceResponsePayload;
}

export const PreviewPaymentDetailsSection = ({
  invoice,
}: PreviewPaymentDetailsSectionProps) => {
  const { i18n } = useLingui();

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>{t(
        i18n
      )`Payment details`}</Typography>
      <MoniteCard
        items={[
          {
            label: t(i18n)`Payment terms`,
            value: invoice.payment_terms?.name,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Bank account`,
            value:
              invoice.entity_bank_account?.bank_name ??
              invoice.entity_bank_account?.display_name,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`IBAN`,
            value: invoice.entity_bank_account?.iban,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`BIC`,
            value: invoice.entity_bank_account?.bic,
            withEmptyStateFiller: true,
          },
        ]}
      />
    </Box>
  );
};
