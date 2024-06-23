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

export const InvoiceItems = ({ invoice }: PayablesDetailsInfoProps) => {
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
            {invoice?.line_items?.map((item, index) => (
              <TableRow key={index}>
                <TableCell style={{ width: '45%' }}>
                  <Typography>{item.product.name}</Typography>
                </TableCell>
                <TableCell style={{ width: '20%' }}>
                  <Typography>
                    {item.product.price &&
                      item.product.price.value &&
                      item.product.price.currency &&
                      formatCurrencyToDisplay(
                        item.product.price.value,
                        item.product.price.currency
                      )}
                  </Typography>
                </TableCell>
                <TableCell style={{ width: '15%' }}>
                  <Typography>{item.quantity}</Typography>
                </TableCell>
                <TableCell style={{ width: '20%' }}>
                  <Typography>
                    {item.product.price &&
                      item.product.price.currency &&
                      formatCurrencyToDisplay(
                        item.quantity * item.product.price.value,
                        item.product.price.currency
                      )}
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
