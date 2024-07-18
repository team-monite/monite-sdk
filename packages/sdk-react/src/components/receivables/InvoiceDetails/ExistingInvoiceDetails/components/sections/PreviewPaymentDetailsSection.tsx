import React from 'react';

import { components } from '@/api';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

export const PreviewPaymentDetailsSection = ({
  payment_terms,
  entity_bank_account,
}: components['schemas']['InvoiceResponsePayload']) => {
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
            value: payment_terms?.name,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Bank account`,
            value:
              entity_bank_account?.bank_name ??
              entity_bank_account?.display_name,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`IBAN`,
            value: entity_bank_account?.iban,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`BIC`,
            value: entity_bank_account?.bic,
            withEmptyStateFiller: true,
          },
        ]}
      />
    </Box>
  );
};
