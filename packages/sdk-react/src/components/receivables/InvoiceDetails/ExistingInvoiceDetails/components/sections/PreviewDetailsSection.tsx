import { components } from '@/api';
import { MoniteCard } from '@/ui/Card/Card';
import { DateTimeFormatOptions } from '@/utils/DateTimeFormatOptions';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

export const PreviewDetailsSection = ({
  entity_vat_id,
  fulfillment_date,
  purchase_order,
  memo,
}: components['schemas']['InvoiceResponsePayload']) => {
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
            value: entity_vat_id && t(i18n)`VAT ID ${entity_vat_id.value}`,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Fulfillment date`,
            value: fulfillment_date
              ? i18n.date(
                  fulfillment_date,
                  DateTimeFormatOptions.ShortMonthDateFormat
                )
              : '—',
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Purchase order`,
            value: purchase_order,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Message`,
            value: memo,
            withEmptyStateFiller: true,
          },
        ]}
      />
    </Box>
  );
};
