import { components } from '@/api';
import { FinancedInvoiceStatusChip } from '@/components/financing/components';
import { InvoiceStatusChip } from '@/components/receivables/components';
import { INVOICE_DOCUMENT_AUTO_ID } from '@/components/receivables/consts';
import { useKanmonContext } from '@/core/context/KanmonContext';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  darken,
  Divider,
  Typography,
  useTheme,
} from '@mui/material';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  financedInvoice: components['schemas']['FinancingInvoice'] | null;
  offers?: components['schemas']['FinancingOffer'][];
  enableNavigate?: boolean;
  handleNavigate?: (invoice_id: string) => void;
};

export const FinanceDetails = ({
  invoice,
  offers,
  financedInvoice,
  enableNavigate = false,
  handleNavigate,
}: Props) => {
  const { i18n } = useLingui();
  const { locale } = useMoniteContext();
  const { startFinanceSession } = useKanmonContext();
  const { formatCurrencyToDisplay } = useCurrencies();
  const theme = useTheme();
  const dateFormat = locale.dateFormat;
  const issueDate = financedInvoice
    ? i18n.date(financedInvoice.issue_date, dateFormat)
    : '—';
  const invoiceAmount = financedInvoice
    ? formatCurrencyToDisplay(
        financedInvoice.total_amount,
        financedInvoice.currency
      )
    : '-';

  const pricingPlan = offers?.[0]?.pricing_plans?.reduce<{
    pricingPlanIndex: number;
    data: {
      advance_rate_percentage: number;
      fee_percentage: number;
      repayment_type: components['schemas']['WCRepaymentType'];
      repayment_duration_days?: number;
    };
  } | null>((acc, cur, index) => {
    if (
      cur?.fee_percentage === financedInvoice?.fee_percentage &&
      cur?.advance_rate_percentage === financedInvoice?.advance_rate_percentage
    ) {
      acc = {
        pricingPlanIndex: index,
        data: cur,
      };
    }

    return acc;
  }, null);

  const repaymentDate = financedInvoice?.repayment_schedule?.repayment_date
    ? i18n.date(financedInvoice.repayment_schedule.repayment_date, dateFormat)
    : '—';

  const receivedSum = financedInvoice?.total_amount
    ? formatCurrencyToDisplay(
        financedInvoice.total_amount,
        financedInvoice.currency
      )
    : '-';

  const serviceFee = financedInvoice?.repayment_schedule
    ? formatCurrencyToDisplay(
        financedInvoice.repayment_schedule.repayment_fee_amount,
        financedInvoice.currency
      )
    : '-';

  const repaymentSum = financedInvoice?.repayment_schedule
    ? formatCurrencyToDisplay(
        financedInvoice.repayment_schedule.repayment_amount,
        financedInvoice.currency
      )
    : '-';

  const isRequestedSum =
    financedInvoice?.status === 'REJECTED' || financedInvoice?.status === 'NEW';

  const shouldDisplayPayOutButton =
    financedInvoice?.status === 'FUNDED' || financedInvoice?.status === 'LATE';

  return (
    <>
      <Box
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        <Typography variant="h3">{t(i18n)`Funding details`}</Typography>
        <Box>
          <Typography variant="h2" fontWeight={600} fontSize={32}>
            {invoiceAmount}
          </Typography>
          <Typography fontWeight={500} variant="body1">{t(
            i18n
          )`${issueDate}`}</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 3,
          }}
        >
          <Box width="100%">
            <Typography
              variant="body1"
              color={darken(theme.palette.grey[50], 0.4)}
              mb={0.5}
              fontWeight={400}
            >{t(i18n)`Financing plan ${
              (pricingPlan?.pricingPlanIndex ?? 0) + 1
            }`}</Typography>

            <Typography variant="body1" fontWeight={400}>
              {t(i18n)`${
                (pricingPlan?.data?.advance_rate_percentage ?? 0) / 100
              }% advance rate, Pay in ${
                pricingPlan?.data?.repayment_duration_days
              } days, ${(pricingPlan?.data?.fee_percentage ?? 0) / 100}% fee`}
            </Typography>
          </Box>
          <Box width="100%">
            <Typography
              variant="body1"
              color={darken(theme.palette.grey[50], 0.4)}
              mb={0.5}
              fontWeight={400}
            >{t(i18n)`Repayment on`}</Typography>
            <Typography variant="body1" fontWeight={400}>{t(
              i18n
            )`${repaymentDate}`}</Typography>
          </Box>
          <Box width="100%">
            <Typography
              variant="body1"
              color={darken(theme.palette.grey[50], 0.4)}
              mb={0.5}
              fontWeight={400}
            >{t(i18n)`Status`}</Typography>

            <FinancedInvoiceStatusChip
              icon
              status={financedInvoice?.status ?? 'DEFAULTED'}
            />
          </Box>
        </Box>
        <Divider />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(140px, auto) 1fr',
            flexDirection: 'column',
            rowGap: 1,
            columnGap: 2,
          }}
        >
          <Typography
            variant="body1"
            color={darken(theme.palette.grey[50], 0.4)}
          >{t(i18n)`${
            isRequestedSum ? 'Requested sum' : 'Received sum'
          }`}</Typography>
          <Typography variant="body1">{receivedSum}</Typography>
          <Typography
            variant="body1"
            color={darken(theme.palette.grey[50], 0.4)}
          >{t(i18n)`Service Fee`}</Typography>
          <Typography variant="body1">{serviceFee}</Typography>
          <Typography
            variant="body1"
            color={darken(theme.palette.grey[50], 0.4)}
          >{t(i18n)`Repayment sum`}</Typography>
          <Typography variant="body1">{repaymentSum}</Typography>
        </Box>

        <Divider />

        <Box
          sx={{
            borderRadius: '16px',
            px: 3,
            py: 2.5,
            border: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            gap: 2,
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: enableNavigate ? 'pointer' : 'default',
          }}
          {...(enableNavigate &&
            handleNavigate && {
              onClick: () => handleNavigate(invoice.id),
            })}
        >
          <Box>
            <Typography variant="body1" fontWeight={500}>
              {t(i18n)`Invoice ${
                invoice.document_id || INVOICE_DOCUMENT_AUTO_ID
              }`}
            </Typography>
            <Typography color={theme.palette.text.secondary} variant="body2">{t(
              i18n
            )`For ${invoiceAmount} | Issued ${issueDate}`}</Typography>
          </Box>
          <Box>
            <InvoiceStatusChip icon status={invoice.status} />
          </Box>
        </Box>
      </Box>

      {shouldDisplayPayOutButton && (
        <Box
          sx={{
            mt: 'auto',
            borderTop: `1px solid ${theme.palette.divider}`,
            px: 4,
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => startFinanceSession({ component: 'PAY_NOW' })}
            sx={{ py: 1.25, px: 1.5, height: 32, fontSize: 14, ml: 'auto' }}
          >
            {t(i18n)`Repay now`}
          </Button>
        </Box>
      )}
    </>
  );
};
