'use client';

import React from 'react';

import { useCurrencies } from '@/core/hooks/useCurrencies';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ReceivableResponse } from '@monite/sdk-api';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

export type PayablesDetailsInfoProps = {
  invoice: ReceivableResponse;
};

export const InvoiceTotal = ({ invoice }: PayablesDetailsInfoProps) => {
  const { i18n } = useLingui();
  const { formatCurrencyToDisplay } = useCurrencies();
  const { currency, total_amount, total_vat_amount } = invoice;

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
