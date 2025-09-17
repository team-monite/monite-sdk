import { components } from '@/api';
import { useCurrencies } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';

export const DisplayPayableLineItems = ({
  lineItems,
  currency,
}: {
  lineItems: components['schemas']['LineItemResponse'][] | undefined;
  currency: components['schemas']['CurrencyEnum'];
}) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <Paper variant="outlined">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t(i18n)`Name`}</TableCell>
            <TableCell>{t(i18n)`Quantity`}</TableCell>
            <TableCell>{t(i18n)`Price`}</TableCell>
            <TableCell align="right">{t(i18n)`Total, tax`}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {lineItems?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>
                {item.unit_price
                  ? formatCurrencyToDisplay(item.unit_price, currency)
                  : '—'}
              </TableCell>
              <TableCell align="right">
                {item.subtotal ? (
                  <>
                    <Box>
                      {formatCurrencyToDisplay(item.subtotal ?? 0, currency)}
                    </Box>
                    <Box sx={{ color: 'secondary.main' }}>
                      {t(i18n)`excl. Tax`}{' '}
                      {`${item.tax ? (item.tax / 100).toFixed(0) : 0}%`}
                    </Box>
                  </>
                ) : (
                  formatCurrencyToDisplay(0, currency)
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};
