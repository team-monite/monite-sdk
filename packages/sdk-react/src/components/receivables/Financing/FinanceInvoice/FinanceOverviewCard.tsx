import { useState } from 'react';

import { components } from '@/api';
import { Dialog } from '@/components/Dialog';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { useGetFinancedInvoices } from '@/core/queries/useFinancing';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Skeleton, Typography } from '@mui/material';

import { InvoiceStatusChip } from '../../InvoiceStatusChip';
import { FinanceDetails } from './FinanceDetails';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  offers: {
    offers: components['schemas']['FinancingOffer'][];
    business_status: components['schemas']['WCBusinessStatus'];
  } | null;
};

export const FinanceOverviewCard = ({ invoice, offers }: Props) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const { formatCurrencyToDisplay } = useCurrencies();

  const { isLoading, data } = useGetFinancedInvoices({
    invoice_id: invoice.id,
    type: 'receivable',
  });

  const financedInvoice = data?.data?.[0] ?? null;

  const dateFormat = locale.dateFormat;

  const repaymentAmount = financedInvoice
    ? formatCurrencyToDisplay(
        financedInvoice.repayment_schedule?.repayment_amount ?? 0,
        invoice.currency
      )
    : '—';

  const repaymentDate = financedInvoice?.repayment_schedule?.repayment_date
    ? i18n.date(financedInvoice?.repayment_schedule?.repayment_date, dateFormat)
    : '—';

  const repaymentStatus = financedInvoice?.status;

  if (isLoading) {
    return <Skeleton variant="rounded" height={80} />;
  }

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
            {t(i18n)`Funding for ${repaymentAmount}`}
          </Typography>
          <Typography variant="body1">
            {t(i18n)`Repayment on ${repaymentDate}`}
          </Typography>
        </Box>
        <Box>
          <InvoiceStatusChip status={repaymentStatus ?? 'DEFAULTED'} />
        </Box>
      </Box>

      <Dialog
        open={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
        alignDialog="right"
      >
        <FinanceDetails
          invoice={invoice}
          offers={offers}
          financedInvoice={financedInvoice}
        />
      </Dialog>
    </>
  );
};
