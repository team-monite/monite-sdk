import React, { ReactNode } from 'react';

import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
  counterpartName: ReactNode;
  counterpartAddress: components['schemas']['CounterpartAddress'];
};

export const InvoiceTo = ({
  counterpartName,
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
              <TableCell>{counterpartName}</TableCell>
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
