import React, { useMemo } from 'react';

import { components } from '@/api';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCounterpartById } from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Skeleton, Typography } from '@mui/material';

const getAddress = (address?: components['schemas']['CounterpartAddress']) => {
  if (!address) {
    return null;
  }

  return `${address.postal_code}, ${address.city}, ${address.line1}`;
};

export const PreviewCustomerSection = ({
  counterpart_id,
  counterpart_billing_address,
  counterpart_shipping_address,
  counterpart_contact,
  counterpart_vat_id,
  counterpart_tax_id,
}: components['schemas']['InvoiceResponsePayload']) => {
  const { i18n } = useLingui();
  const {
    data: counterpart,
    isLoading: isCounterpartLoading,
    error: counterpartError,
  } = useCounterpartById(counterpart_id);

  const counterpartName = useMemo(() => {
    if (isCounterpartLoading) {
      return <Skeleton variant="text" width="50%" />;
    }

    if (counterpartError) {
      return '—';
    }

    if (counterpart) {
      return getCounterpartName(counterpart);
    }
  }, [counterpart, counterpartError, isCounterpartLoading]);

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Typography variant="subtitle2">{t(i18n)`Customer`}</Typography>
      </Box>
      <MoniteCard
        items={[
          {
            label: t(i18n)`Bill to`,
            value: <Typography fontWeight={500}>{counterpartName}</Typography>,
          },
          {
            label: t(i18n)`Contact person`,
            value:
              counterpart_contact &&
              `${counterpart_contact.first_name} ${counterpart_contact.last_name}`,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`VAT information`,
            value:
              counterpart_vat_id && t(i18n)`VAT ID ${counterpart_vat_id.value}`,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Tax information`,
            value: counterpart_tax_id && t(i18n)`Tax ID ${counterpart_tax_id}`,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Billing address`,
            value: getAddress(counterpart_billing_address),
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Shipping address`,
            value: getAddress(counterpart_shipping_address),
            withEmptyStateFiller: true,
          },
        ]}
      />
    </Box>
  );
};
