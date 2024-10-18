import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { useEntityUserById, usePaymentIntentById } from '@/core/queries';
import { useDateTimeFormat } from '@/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { Box, Alert, Skeleton, Typography } from '@mui/material';

// import { ChevronRight } from '@mui/icons-material'; // Hidden for future design iteration

export const PaymentRecordRow = ({
  invoice,
  record,
}: {
  invoice: components['schemas']['InvoiceResponsePayload'];
  record: components['schemas']['PaymentRecordResponse'];
}) => {
  const { i18n } = useLingui();
  const dateTimeFormat = useDateTimeFormat();
  const { data: entityUser, isLoading: isEntityUserLoading } =
    useEntityUserById(record.entity_user_id);

  const { data: paymentIntent, isLoading: isPaymentIntentLoading } =
    usePaymentIntentById(record.payment_intent_id);

  const { formatCurrencyToDisplay } = useCurrencies();
  const getPaymentRecordTitle = () => {
    if (!record.is_external) {
      return t(i18n)`${
        paymentIntent?.selected_payment_method?.replace(/_/g, ' ') ?? ''
      }`;
    }

    if (!entityUser) {
      return t(i18n)`Manual payment record`;
    }

    return `${t(i18n)`Payment record by`} ${`${entityUser?.first_name ?? ''} ${
      entityUser?.last_name ?? ''
    }`}`;
  };

  const recordTitle = getPaymentRecordTitle();
  const recordStatus = record.is_external
    ? t(i18n)`Settled`
    : paymentIntent?.status ?? t(i18n)`Settled`;

  const isLoading = isEntityUserLoading || isPaymentIntentLoading;

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        gap: 4,
        paddingTop: 1,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ minWidth: '104px' }}>
        <Alert sx={{ px: 1, py: 0, width: 'fit-content' }} severity="success">
          {recordStatus}
        </Alert>
      </Box>
      <Box sx={{ flex: '1 1 0%' }}>
        {isLoading ? (
          <Skeleton variant="text" width={100} />
        ) : (
          <Typography variant="body1">{recordTitle}</Typography>
        )}
        <Typography variant="body2" color="textSecondary">
          {i18n.date(new Date(record.paid_at), dateTimeFormat)}
        </Typography>
      </Box>
      <Box
        sx={{
          minWidth: '104px',
          alignItems: 'center',
          display: 'flex',
          gap: 4,
        }}
      >
        <Typography variant="body1" color="textSecondary">
          {formatCurrencyToDisplay(record.amount, invoice.currency)}
        </Typography>
        {/* Hidden for future design iteration */}
        {/* <Box>
            <ChevronRight />
          </Box> */}
      </Box>
    </Box>
  );
};

export const EmptyPaymentRecord = () => {
  const { i18n } = useLingui();
  return (
    <Box
      sx={{
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '24px',
      }}
    >
      <ReceiptOutlinedIcon fontSize="large" />

      <Typography variant="body1" color="textSecondary">
        {t(i18n)`No payments yet`}
      </Typography>
    </Box>
  );
};
