import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { useDateTimeFormat } from '@/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { Alert, Box, Skeleton, Typography } from '@mui/material';

import { PaymentRecordDetails } from './RecordManualPaymentModal';

type Props = {
  paymentRecords: PaymentRecordDetails;
  invoice: components['schemas']['InvoiceResponsePayload'];
};

export const ManualPaymentRecordDetails = ({
  paymentRecords,
  invoice,
}: Props) => {
  const { i18n } = useLingui();
  const dateTimeFormat = useDateTimeFormat();
  const { formatCurrencyToDisplay } = useCurrencies();

  const dateTime = i18n.date(
    new Date(paymentRecords.payment_date ?? ''),
    dateTimeFormat
  );

  const { data: entityUser, isLoading: isEntityUserLoading } =
    useEntityUserByAuthToken();

  const paymentAuthor = `${entityUser?.first_name} ${entityUser?.last_name}`;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box
          sx={{
            borderRadius: '100%',
            backgroundColor: '#F2F2F2',
            width: '44px',
            height: '44px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DriveFileRenameOutlineIcon sx={{ color: '#707070' }} />
        </Box>
        <Typography variant="body1">{t(
          i18n
        )`Manual payment record`}</Typography>
        <Box>
          <Typography variant="h2">
            {formatCurrencyToDisplay(paymentRecords.amount, invoice.currency)}
          </Typography>
          <Typography variant="body1">{t(
            i18n
          )`from ${invoice.counterpart_name}`}</Typography>
        </Box>
      </Box>

      <MoniteCard
        items={[
          {
            label: t(i18n)`Received`,
            value: !paymentRecords.payment_date ? (
              '—'
            ) : (
              <Typography fontWeight={500}>{dateTime}</Typography>
            ),
          },
          {
            label: t(i18n)`Reference`,
            value: !invoice.id ? (
              '—'
            ) : (
              <Typography fontWeight={500}>{invoice.id}</Typography>
            ),
          },
          {
            label: t(i18n)`Created by`,
            value: isEntityUserLoading ? (
              <Skeleton variant="text" width="50%" />
            ) : !paymentAuthor ? (
              '—'
            ) : (
              <Typography fontWeight={500}>{paymentAuthor}</Typography>
            ),
          },
        ]}
      />

      <Alert severity="warning">
        <Typography variant="body2">{t(
          i18n
        )`Please, check the details of your payment record.
  You won't be able to change or delete it after.`}</Typography>
      </Alert>
    </Box>
  );
};
