import { useState } from 'react';

import { components } from '@/api';
import { Dialog } from '@/components/Dialog';
import { useCurrencies } from '@/core/hooks';
import { useDateFormat } from '@/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';

import { InvoiceStatusChip } from '../../InvoiceStatusChip';
import { FinanceDetails } from './FinanceDetails';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
};

export const FinanceOverviewCard = ({ invoice }: Props) => {
  const { i18n } = useLingui();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const { formatCurrencyToDisplay } = useCurrencies();
  const dateFormat = useDateFormat();

  const invoiceAmount = formatCurrencyToDisplay(
    invoice.amount_due,
    invoice.currency
  );

  const repaymentDate = invoice?.issue_date
    ? i18n.date(invoice?.issue_date, dateFormat)
    : '—';

  return (
    <>
      <Box
        onClick={() => setDialogIsOpen(true)}
        sx={{
          borderRadius: 3,
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-between',
          border: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
        }}
      >
        <Box>
          <Typography variant="subtitle2">
            {t(i18n)`Funding for ${invoiceAmount}`}
          </Typography>
          <Typography variant="body1">
            {t(i18n)`Repayment on ${repaymentDate}`}
          </Typography>
        </Box>
        <Box>
          <InvoiceStatusChip status={invoice.status} />
        </Box>
      </Box>

      <Dialog
        // className={className + '-Dialog-ProductsTable'}
        open={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
        alignDialog="right"
      >
        <FinanceDetails invoice={invoice} />
      </Dialog>
    </>
  );
};
