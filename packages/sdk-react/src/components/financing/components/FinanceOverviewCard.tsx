import { FinanceDetails } from './FinanceDetails';
import { components } from '@/api';
import { FinancedInvoiceStatusChip } from '@/components/financing/components/FinancedInvoiceStatusChip';
import { useGetFinancedInvoices } from '@/components/financing/hooks';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { Dialog } from '@/ui/Dialog';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Skeleton, Typography, useTheme } from '@mui/material';
import { useState } from 'react';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  offers: {
    offers: components['schemas']['FinancingOffer'][];
    business_status: components['schemas']['WCBusinessStatus'];
  } | null;
};

export const FinanceOverviewCard = ({ invoice, offers }: Props) => {
  const { i18n } = useLingui();
  const theme = useTheme();
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
          borderRadius: '16px',
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          border: `1px solid ${theme.palette.divider}`,
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
          <FinancedInvoiceStatusChip
            icon
            status={repaymentStatus ?? 'DEFAULTED'}
          />
        </Box>
      </Box>

      <Dialog
        open={dialogIsOpen}
        onClose={() => setDialogIsOpen(false)}
        alignDialog="right"
      >
        <FinanceDetails
          invoice={invoice}
          offers={offers?.offers}
          financedInvoice={financedInvoice}
        />
      </Dialog>
    </>
  );
};
