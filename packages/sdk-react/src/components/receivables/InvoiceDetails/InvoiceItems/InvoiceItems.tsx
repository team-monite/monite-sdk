import { components } from '@/api';
import { useCurrencies } from '@/core/hooks/useCurrencies';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

export const InvoiceItems = ({
  line_items,
}: components['schemas']['ReceivableResponse']) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <Box mt={2}>
      <Typography variant="subtitle2">{t(i18n)`Items`}</Typography>
      <Card variant="outlined">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ width: '45%' }}>
                <Typography>{t(i18n)`Name`}</Typography>
              </TableCell>
              <TableCell style={{ width: '20%' }}>
                <Typography>{t(i18n)`Price`}</Typography>
              </TableCell>
              <TableCell style={{ width: '15%' }}>
                <Typography>{t(i18n)`Amount`}</Typography>
              </TableCell>
              <TableCell style={{ width: '20%' }}>
                <Typography>{t(i18n)`Total`}</Typography>
              </TableCell>
            </TableRow>
            {line_items?.map(({ product: { id, name, price }, quantity }) => (
              <TableRow key={id}>
                <TableCell style={{ width: '45%' }}>
                  <Typography>{name}</Typography>
                </TableCell>
                <TableCell style={{ width: '20%' }}>
                  <Typography>
                    {price &&
                      price.value &&
                      price.currency &&
                      formatCurrencyToDisplay(price.value, price.currency)}
                  </Typography>
                </TableCell>
                <TableCell style={{ width: '15%' }}>
                  <Typography>{quantity}</Typography>
                </TableCell>
                <TableCell style={{ width: '20%' }}>
                  <Typography>
                    {price?.currency
                      ? formatCurrencyToDisplay(
                          quantity * price.value,
                          price.currency
                        )
                      : '—'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
