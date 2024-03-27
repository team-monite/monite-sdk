import React from 'react';

import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { InvoiceResponsePayload } from '@monite/sdk-api';
import { Box, Typography } from '@mui/material';

interface IPreviewDetailsSectionProps {
  invoice: InvoiceResponsePayload;
}

export const PreviewDetailsSection = ({
  invoice,
}: IPreviewDetailsSectionProps) => {
  const { i18n } = useLingui();

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>{t(
        i18n
      )`Details`}</Typography>
      <MoniteCard
        items={[
          {
            label: t(i18n)`Your tax information`,
            value:
              invoice.entity_vat_id &&
              t(i18n)`VAT ID ${invoice.entity_vat_id.value}`,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Fulfullment date`,
            value:
              invoice.counterpart_contact &&
              `${invoice.counterpart_contact.first_name} ${invoice.counterpart_contact.last_name}`,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Purchase order`,
            value: invoice.purchase_order,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Message`,
            value: invoice.memo,
            withEmptyStateFiller: true,
          },
        ]}
      />
    </Box>
  );
};
