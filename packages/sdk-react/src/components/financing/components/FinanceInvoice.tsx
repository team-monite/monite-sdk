import { components } from '@/api';
import { FinanceBannerWrapper } from '@/components/financing/components/FinanceBannerWrapper';
import { FinanceOverviewCard } from '@/components/financing/components/FinanceOverviewCard';
import {
  useFinanceAnInvoice,
  useFinancing,
  useGetFinancedInvoices,
  useGetFinanceOffers,
} from '@/components/financing/hooks';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

const SIX_DAYS_IN_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;

interface FinanceInvoiceProps {
  invoice: components['schemas']['InvoiceResponsePayload'];
}

export const FinanceInvoice = ({ invoice }: FinanceInvoiceProps) => {
  const { i18n } = useLingui();
  const { startFinanceSession } = useKanmonContext();
  const [isFinancingAnInvoice, setIsFinancingAnInvoice] = useState(false);
  const financeInvoiceMutation = useFinanceAnInvoice();

  const { isLoading: isLoadingFinancedInvoices, data: financedInvoices } =
    useGetFinancedInvoices({
      invoice_id: invoice.id,
      type: 'receivable',
    });

  const {
    isLoading: isLoadingFinanceSdk,
    isEnabled,
    isServicing,
  } = useFinancing();

  const { isLoading: isLoadingFinanceOffers, data: financeOffersData } =
    useGetFinanceOffers();

  const isFinanced = Boolean(
    financedInvoices?.data?.find(
      (financedInvoice) => financedInvoice?.invoice_id === invoice.id
    )
  );

  const isLoading =
    isLoadingFinanceSdk || isLoadingFinancedInvoices || isLoadingFinanceOffers;

  const invoiceStatusIsValid = ['issued', 'partially_paid'].includes(
    invoice.status
  );

  const invoiceDueDateIsValid = invoice.due_date
    ? new Date(invoice.due_date).getTime() -
        (new Date().getTime() + SIX_DAYS_IN_MILLISECONDS) >
      0
    : false;
  const invoiceIsEligibleForFinance =
    invoiceStatusIsValid && invoiceDueDateIsValid;

  const financeInvoice = async () => {
    try {
      setIsFinancingAnInvoice(true);
      financeInvoiceMutation.mutate(
        {
          invoices: [
            {
              id: invoice.id,
              type: 'receivable',
            },
          ],
        },
        {
          onError: () => {
            setIsFinancingAnInvoice(false);
          },
          onSuccess: ({ session_token }) => {
            startFinanceSession({
              sessionToken: session_token,
              component: 'SESSION_INVOICE_FLOW_WITH_INVOICE_FILE',
            });
            setIsFinancingAnInvoice(false);
          },
        }
      );
    } catch {
      setIsFinancingAnInvoice(false);
    }
  };

  if (!isEnabled || !isServicing) {
    return null;
  }

  if (isFinanced) {
    return (
      <Box>
        <FinanceOverviewCard
          invoice={invoice}
          offers={financeOffersData ?? null}
        />
      </Box>
    );
  }

  if (!invoiceIsEligibleForFinance) {
    return (
      <FinanceBannerWrapper>
        <Box sx={{ flex: '1 1 0%' }}>
          <Typography variant="subtitle2">{t(
            i18n
          )`This invoice can’t be financed`}</Typography>
          <Typography variant="body1">
            {t(
              i18n
            )`It must be in the “Issued” or “Partially paid” statuses and have more than 7 days till overdue.`}
          </Typography>
        </Box>
      </FinanceBannerWrapper>
    );
  }

  return (
    <FinanceBannerWrapper>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flex: '1 1 0%' }}>
          <Typography variant="subtitle2">{t(
            i18n
          )`Don’t wait for your client to pay`}</Typography>
          <Typography variant="body1">
            {t(i18n)`This invoice can be financed`}.{' '}
            <Tooltip
              arrow
              title={t(
                i18n
              )`Invoices that are due within 7 days cannot be financed. Overdue invoices cannot be financed. The loan sum must be within your remaining limit.`}
            >
              <Typography
                variant="body1"
                sx={{ textDecoration: 'underline' }}
                component="span"
              >{t(i18n)`Why?`}</Typography>
            </Tooltip>
          </Typography>
        </Box>

        <Button
          onClick={financeInvoice}
          disabled={isFinancingAnInvoice || isLoading}
          color="primary"
          variant="contained"
          sx={{
            px: 2.5,
            py: 1.5,
          }}
        >
          {isFinancingAnInvoice ? t(i18n)`Loading...` : t(i18n)`Get paid now`}
        </Button>
      </Box>
    </FinanceBannerWrapper>
  );
};
