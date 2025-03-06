import { useState } from 'react';

import { components } from '@/api';
import { FinanceOverviewCard } from '@/components/receivables/Financing/FinanceInvoice/FinanceOverviewCard';
import { useWorkingCapitalOnboarding } from '@/components/receivables/Financing/hooks/useWorkingCapitalOnboarding';
import { FinanceCardStack } from '@/components/receivables/Financing/infographics/FinanceCardStack';
import {
  useFinanceAnInvoice,
  useFinancing,
  useGetFinancedInvoices,
  useGetFinanceOffers,
} from '@/core/queries/useFinancing';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material';

const SIX_DAYS_IN_MILLISECONDS = 6 * 24 * 60 * 60 * 1000;

interface FinanceInvoiceProps {
  invoice: components['schemas']['InvoiceResponsePayload'];
  onWorkingCapitalOnboardingComplete?: () => void;
}

export const FinanceInvoice = ({
  invoice,
  onWorkingCapitalOnboardingComplete,
}: FinanceInvoiceProps) => {
  const { i18n } = useLingui();
  const [isFinancingAnInvoice, setIsFinancingAnInvoice] = useState(false);

  const { isLoading: isLoadingFinancedInvoices, data: financedInvoices } =
    useGetFinancedInvoices({
      invoice_id: invoice.id,
      type: 'receivable',
    });

  const {
    isLoading: isLoadingFinanceSdk,
    isEnabled,
    isInitializing,
    startFinanceSession,
  } = useFinancing();

  const { isLoading: isLoadingFinanceOffers, data: financeOffersData } =
    useGetFinanceOffers();

  const { isOnboarded } = useWorkingCapitalOnboarding(
    onWorkingCapitalOnboardingComplete
  );

  const isLoading =
    isLoadingFinanceSdk || isLoadingFinancedInvoices || isLoadingFinanceOffers;

  const financeInvoiceMutation = useFinanceAnInvoice();

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

  if (isLoading) {
    return <CircularProgress color="inherit" size={20} />;
  }

  if (!isEnabled || !isOnboarded) {
    return null;
  }

  const isFinanced = financedInvoices?.data?.length;

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
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: '#CDC9FF',
        borderRadius: 3,
        p: 3,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <FinanceCardStack
        sx={{
          position: 'absolute',
          width: '360px',
          height: '206px',
          bottom: 0,
          right: 0,
          zIndex: 0,
        }}
      />
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
        <Box
          sx={{
            flex: '1 1 0%',
          }}
        >
          <Box sx={{ flex: '1 1 0%' }}>
            <Typography variant="subtitle2">{t(
              i18n
            )`Don't wait for the payment`}</Typography>
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
        </Box>
        <Box>
          {isInitializing ? (
            <Skeleton variant="rounded" width="140px" height="32px" />
          ) : (
            <Button
              onClick={financeInvoice}
              disabled={isFinancingAnInvoice}
              sx={{ backgroundColor: 'black', color: 'white' }}
            >
              {isFinancingAnInvoice
                ? t(i18n)`Loading...`
                : t(i18n)`Get paid now`}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
