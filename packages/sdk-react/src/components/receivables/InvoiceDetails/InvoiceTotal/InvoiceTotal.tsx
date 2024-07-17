import React from 'react';

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

export const InvoiceTotal = ({
  currency,
  total_amount,
  total_vat_amount,
}: components['schemas']['ReceivableResponse']) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();

  return (
    <Box mt={2}>
      <Typography variant="subtitle2">{t(i18n)`Total`}</Typography>
      <Card variant="outlined">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>{t(i18n)`Subtotal`}</Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {total_amount !== undefined &&
                    formatCurrencyToDisplay(
                      total_amount - total_vat_amount,
                      currency
                    )}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>{t(i18n)`VAT`}</Typography>
              </TableCell>
              <TableCell>
                <Typography>
                  {formatCurrencyToDisplay(total_vat_amount, currency)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>{t(i18n)`Total`}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline" fontWeight="fontWeightBold">
                  {total_amount !== undefined &&
                    formatCurrencyToDisplay(total_amount, currency)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
