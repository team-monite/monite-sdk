import { components } from '@/api';
import { ManualPaymentRecordFormValues } from '@/components/receivables/validation';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { Alert, Box, Skeleton, Typography } from '@mui/material';

type Props = {
  paymentRecords: ManualPaymentRecordFormValues & { created_by: string };
  invoice: components['schemas']['InvoiceResponsePayload'];
};

export const ManualPaymentRecordDetails = ({
  paymentRecords,
  invoice,
}: Props) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { formatCurrencyToDisplay } = useCurrencies();

  const dateTimeWithReplacedTime = new Date(
    paymentRecords.payment_date ?? ''
  ).setHours(
    paymentRecords.payment_time?.getHours() ?? 0,
    paymentRecords.payment_time?.getMinutes() ?? 0
  );

  const dateTime = i18n.date(
    new Date(dateTimeWithReplacedTime),
    locale.dateTimeFormat
  );

  const { data: entityUser, isLoading: isEntityUserLoading } =
    useEntityUserByAuthToken();

  const paymentAuthor = `${entityUser?.first_name ?? ''} ${
    entityUser?.last_name ?? ''
  }`;

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
            {formatCurrencyToDisplay(
              paymentRecords?.amount ?? 0,
              invoice.currency
            )}
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
  You won’t be able to change or delete it after.`}</Typography>
      </Alert>
    </Box>
  );
};
