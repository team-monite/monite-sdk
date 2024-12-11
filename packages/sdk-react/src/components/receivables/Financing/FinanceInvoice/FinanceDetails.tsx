import { components } from '@/api';
import { InvoiceStatusChip } from '@/components/receivables/InvoiceStatusChip';
import { useCurrencies } from '@/core/hooks';
import { useDateFormat } from '@/utils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Divider,
  List,
  ListItem,
  Typography,
  useTheme,
} from '@mui/material';

import { INVOICE_DOCUMENT_AUTO_ID } from '../../consts';

type Props = {
  invoice: components['schemas']['InvoiceResponsePayload'];
  financedInvoice: components['schemas']['FinancingInvoice'] | null;
  offers: {
    offers: components['schemas']['FinancingOffer'][];
    business_status: components['schemas']['WCBusinessStatus'];
  } | null;
};

export const FinanceDetails = ({ invoice, offers, financedInvoice }: Props) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();
  const theme = useTheme();
  const dateFormat = useDateFormat();
  const issueDate = financedInvoice
    ? i18n.date(financedInvoice.issue_date, dateFormat)
    : '—';
  const invoiceAmount = financedInvoice
    ? formatCurrencyToDisplay(
        financedInvoice.total_amount,
        financedInvoice.currency
      )
    : '-';

  const financePlans = offers?.offers.map((offer) => ({
    name: t(i18n)`Financing plan`,
    items: offer.pricing_plans.map(
      (item) =>
        t(i18n)`${item.advance_rate_percentage / 100}% advance rate, Pay in ${
          item.repayment_duration_days
        } days, ${item.fee_percentage / 100}% fee`
    ),
  }));

  const repaymentDate = financedInvoice?.repayment_schedule?.repayment_date
    ? i18n.date(financedInvoice.repayment_schedule.repayment_date, dateFormat)
    : '—';

  const receivedSum = financedInvoice
    ? formatCurrencyToDisplay(
        financedInvoice.total_amount,
        financedInvoice.currency
      )
    : '-';

  const serviceFee = financedInvoice
    ? formatCurrencyToDisplay(
        financedInvoice.repayment_schedule?.repayment_fee_amount ?? 0,
        financedInvoice.currency
      )
    : '-';

  const repaymentSum = financedInvoice
    ? formatCurrencyToDisplay(
        financedInvoice.repayment_schedule?.repayment_amount ?? 0,
        financedInvoice.currency
      )
    : '-';
  const paymentDate = financedInvoice?.repayment_schedule?.repayment_date
    ? i18n.date(financedInvoice?.repayment_schedule?.repayment_date, dateFormat)
    : '—';
  const paymentAmount = financedInvoice
    ? formatCurrencyToDisplay(
        financedInvoice.total_amount,
        financedInvoice.currency
      )
    : '-';

  return (
    <Box
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <Typography variant="h3">{t(i18n)`Funding details`}</Typography>
      {/* Invoice summary */}
      <Box
        sx={{
          borderRadius: 3,
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant="body1" fontWeight={500}>
            {t(i18n)`Invoice ${
              invoice.document_id || INVOICE_DOCUMENT_AUTO_ID
            }`}
          </Typography>
          <Typography
            mt={1}
            color={theme.palette.text.secondary}
            variant="body2"
          >{t(i18n)`For ${invoiceAmount} | Issued ${issueDate}`}</Typography>
        </Box>
        <Box>
          <InvoiceStatusChip status={invoice.status} />
        </Box>
      </Box>

      {/* Amount and date */}
      <Box>
        <Typography variant="h2">{invoiceAmount}</Typography>
        <Typography mt={1} fontWeight={500} variant="body1">{t(
          i18n
        )`${issueDate}`}</Typography>
      </Box>

      {/* Finance plans */}
      {financePlans?.map((plan, index) => (
        <Box
          key={plan.name}
          sx={{
            display: 'flex',
            gap: 4,
          }}
        >
          <Box width="100%">
            <Typography variant="body1" color={theme.palette.text.secondary}>{t(
              i18n
            )`Financing plan ${index + 1}`}</Typography>
            <List>
              {plan.items.map((item) => (
                <ListItem key={item} sx={{ p: 0, mt: 1 }}>
                  <Typography variant="body1">{t(i18n)`${item}`}</Typography>
                </ListItem>
              ))}
            </List>
          </Box>
          <Box width="100%">
            <Typography variant="body1" color={theme.palette.text.secondary}>{t(
              i18n
            )`Repayment on`}</Typography>
            <Typography variant="body1">{t(i18n)`${repaymentDate}`}</Typography>
          </Box>
          <Box width="100%">
            <Typography variant="body1" color={theme.palette.text.secondary}>{t(
              i18n
            )`Status`}</Typography>
            <Box>
              <InvoiceStatusChip
                status={financedInvoice?.status ?? 'DEFAULTED'}
              />
            </Box>
          </Box>
        </Box>
      ))}
      <Divider />
      {/* Payment breakdown */}
      <Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(140px, auto) 1fr',
            flexDirection: 'column',
            rowGap: 1,
            columnGap: 2,
          }}
        >
          <Typography variant="body1" color={theme.palette.text.secondary}>{t(
            i18n
          )`Received sum`}</Typography>
          <Typography variant="body1">{receivedSum}</Typography>
          <Typography variant="body1" color={theme.palette.text.secondary}>{t(
            i18n
          )`Service Fee`}</Typography>
          <Typography variant="body1">{serviceFee}</Typography>
          <Typography variant="body1" color={theme.palette.text.secondary}>{t(
            i18n
          )`Repayment sum`}</Typography>
          <Typography variant="body1">{repaymentSum}</Typography>
        </Box>
      </Box>
      <Divider />
      {/* Payment amount and date */}
      <Box
        sx={{
          display: 'flex',
          gap: 4,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="body1" fontWeight={500}>{t(
            i18n
          )`Payment amount`}</Typography>
          <Typography variant="body1">{t(i18n)`${paymentDate}`}</Typography>
        </Box>
        <Box>
          <Typography variant="subtitle1">{paymentAmount}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
