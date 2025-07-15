import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

export const PreviewDetailsSection = ({
  entity_vat_id,
  fulfillment_date,
  purchase_order,
  memo,
  footer,
}: components['schemas']['InvoiceResponsePayload']) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();

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
              ? i18n.date(fulfillment_date, locale.dateFormat)
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
          {
            label: t(i18n)`Note to customer`,
            value: footer,
            withEmptyStateFiller: true,
          },
        ]}
      />
    </Box>
  );
};
