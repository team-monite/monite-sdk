import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';

export const DisplayPayableTotals = ({
  payable,
  currency,
}: {
  payable: components['schemas']['PayableResponseSchema'];
  currency: components['schemas']['CurrencyEnum'];
}) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <Paper variant="outlined">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>{t(i18n)`Subtotal`}</TableCell>
            <TableCell align="right">
              {formatCurrencyToDisplay(payable.subtotal ?? 0, currency)}
            </TableCell>
          </TableRow>
          {payable.discount && payable.discount > 0 ? (
            <TableRow>
              <TableCell>{t(i18n)`Discount`}</TableCell>
              <TableCell align="right">
                {formatCurrencyToDisplay(payable.discount, currency)}
              </TableCell>
            </TableRow>
          ) : null}
          <TableRow>
            <TableCell>{t(i18n)`VAT Total`}</TableCell>
            <TableCell align="right">
              {formatCurrencyToDisplay(payable.tax_amount ?? 0, currency)}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle1">{t(i18n)`Total`}</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle1">
                {formatCurrencyToDisplay(payable.total_amount ?? 0, currency)}
              </Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};
