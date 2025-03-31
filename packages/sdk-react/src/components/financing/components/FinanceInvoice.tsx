import { useState } from 'react';

import { components } from '@/api';
import {
  FinanceBannerPlaceholder,
  FinanceOverviewCard,
} from '@/components/financing/components';
import {
  useFinanceAnInvoice,
  useFinancing,
  useGetFinancedInvoices,
  useGetFinanceOffers,
  startFinanceSession,
} from '@/core/queries/useFinancing';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, Tooltip, Typography } from '@mui/material';

const SIX_DAYS_IN_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;

interface FinanceInvoiceProps {
  invoice: components['schemas']['InvoiceResponsePayload'];
}

export const FinanceInvoice = ({ invoice }: FinanceInvoiceProps) => {
  const { i18n } = useLingui();
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

  if (!invoiceIsEligibleForFinance) {
    return (
      <FinanceBannerPlaceholder shouldDisplayCustomBg={false}>
        <Box sx={{ flex: '1 1 0%' }}>
          <Typography variant="subtitle2">{t(
            i18n
          )`This invoice can't be financed`}</Typography>
          <Typography variant="body1">
            {t(
              i18n
            )`It must be in "Issued" or "Partially paid" status, and should have up to 7 days from the issue date and till it's overdue.`}
          </Typography>
        </Box>
      </FinanceBannerPlaceholder>
    );
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

  return (
    <FinanceBannerPlaceholder shouldDisplayCustomBg>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box sx={{ flex: '1 1 0%' }}>
          <Typography variant="subtitle2">{t(
            i18n
          )`Don't wait for your client to pay`}</Typography>
          <Typography variant="body1">
            {t(i18n)`This invoice can be financed`}.{' '}
            <Tooltip
              arrow
              title={t(
                i18n
              )`The issue date should be less than 7 days ago. You can't fund overdue invoices. The loan sum must be within your remaining limit.`}
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
          sx={{
            backgroundColor: 'black',
            color: 'white',
            ':disabled': {
              color: 'white',
              opacity: 0.5,
            },
          }}
        >
          {isFinancingAnInvoice ? t(i18n)`Loading...` : t(i18n)`Get paid now`}
        </Button>
      </Box>
    </FinanceBannerPlaceholder>
  );
};
