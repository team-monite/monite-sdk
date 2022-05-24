import React, { useMemo } from 'react';

import { getCounterpartName } from '@/components/counterparts/helpers';
import { useCounterpartById } from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CounterpartAddress, InvoiceResponsePayload } from '@monite/sdk-api';
import { Box, Skeleton, Typography } from '@mui/material';

const getAddress = (address?: CounterpartAddress) => {
  if (!address) {
    return null;
  }

  return `${address.postal_code}, ${address.city}, ${address.line1}`;
};

interface IPreviewCustomerSectionProps {
  invoice: InvoiceResponsePayload;
  rightSection?: React.ReactNode;
}

export const PreviewCustomerSection = ({
  invoice,
  rightSection,
}: IPreviewCustomerSectionProps) => {
  const { i18n } = useLingui();
  const {
    data: counterpart,
    isInitialLoading: isCounterpartLoading,
    error: counterpartError,
  } = useCounterpartById(invoice.counterpart_id);

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
        {rightSection}
      </Box>
      <MoniteCard
        items={[
          {
            label: t(i18n)`Bill to`,
            value: counterpartName,
          },
          {
            label: t(i18n)`Contact person`,
            value:
              invoice.counterpart_contact &&
              `${invoice.counterpart_contact.first_name} ${invoice.counterpart_contact.last_name}`,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Tax information`,
            value:
              invoice.counterpart_tax_id &&
              t(i18n)`VAT ID ${invoice.counterpart_tax_id}`,
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Billing address`,
            value: getAddress(invoice.counterpart_billing_address),
            withEmptyStateFiller: true,
          },
          {
            label: t(i18n)`Shipping address`,
            value: getAddress(invoice.counterpart_shipping_address),
            withEmptyStateFiller: true,
          },
        ]}
      />
    </Box>
  );
};
