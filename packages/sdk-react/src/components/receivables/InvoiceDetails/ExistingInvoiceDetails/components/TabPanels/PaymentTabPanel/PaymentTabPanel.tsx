import { Fragment } from 'react';

import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { usePaymentRecords } from '@/core/queries/usePaymentRecords';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Skeleton, Typography } from '@mui/material';

import { EmptyPaymentRecord, PaymentRecordRow } from './PaymentRecordRow';
import { RecordManualPaymentModal } from './RecordManualPaymentModal';
import { UpdatePDFSection } from './UpdatePDF/UpdatePDFSection';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
};

export const PaymentTabPanel: React.FC<Props> = ({ invoice }) => {
  const { i18n } = useLingui();

  const { formatCurrencyToDisplay } = useCurrencies();
  const { data, isLoading } = usePaymentRecords({
    object_id: invoice.id,
  });
  const records = data?.data ?? [];

  return (
    <>
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            padding: 1,
          }}
        >
          <Skeleton variant="rectangular" height={48} />
          <Skeleton variant="rectangular" height={48} />
          <Skeleton variant="rectangular" height={48} />
        </Box>
      ) : records && records.length > 0 ? (
        <Box
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            paddingBottom: 1,
          }}
        >
          {records.map((record) => (
            <Fragment key={record.id}>
              <PaymentRecordRow record={record} invoice={invoice} />
            </Fragment>
          ))}
        </Box>
      ) : (
        <EmptyPaymentRecord />
      )}
      <RecordManualPaymentModal invoice={invoice}>
        {({ openModal }) => (
          <Box marginTop="16px">
            <Button
              startIcon={<AddIcon />}
              fullWidth
              variant="outlined"
              color="primary"
              onClick={openModal}
            >{t(i18n)`Record payment manually`}</Button>
          </Box>
        )}
      </RecordManualPaymentModal>
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          justifyContent: 'space-between',
          marginTop: 2,
        }}
      >
        <Box>
          <Typography variant="body2">{t(i18n)`Amount due`}</Typography>
          <Typography variant="subtitle1">
            {formatCurrencyToDisplay(invoice.amount_due, invoice.currency)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body2">{t(i18n)`Amount paid`}</Typography>
          <Typography variant="subtitle1">
            {formatCurrencyToDisplay(invoice.amount_paid, invoice.currency)}
          </Typography>
        </Box>
      </Box>
      <Box marginTop={4}>
        <UpdatePDFSection invoice={invoice} />
      </Box>
    </>
  );
};
