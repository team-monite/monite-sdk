'use client';

import React from 'react';

import { InvoiceCounterpartName } from '@/components/receivables/InvoiceCounterpartName';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CounterpartAddress } from '@monite/sdk-api';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
} from '@mui/material';

type InvoiceToProps = {
  counterpartId?: string;
  counterpartAddress: CounterpartAddress;
};

export const InvoiceTo = ({
  counterpartId,
  counterpartAddress,
}: InvoiceToProps) => {
  const { i18n } = useLingui();

  return (
    <Box mt={2}>
      <Typography variant="subtitle2">{t(i18n)`To`}</Typography>
      <Card variant="outlined">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <InvoiceCounterpartName counterpartId={counterpartId} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>
                  {counterpartAddress.line1}
                  <br />
                  {counterpartAddress.line2}
                  <br />
                  {counterpartAddress.city}
                  <br />
                  {counterpartAddress.postal_code}
                  <br />
                  {counterpartAddress.state}
                  <br />
                  {counterpartAddress.country}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
