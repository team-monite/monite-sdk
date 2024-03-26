import React from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { EntityBankAccount } from '@monite/sdk-api';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

export type Props = {
  entityBankAccount: EntityBankAccount;
};

export const InvoicePaymentDetails = ({ entityBankAccount }: Props) => {
  const { i18n } = useLingui();

  return (
    <Box mt={2}>
      <Typography variant="subtitle2">{t(i18n)`Payment Details`}</Typography>
      <Card variant="outlined">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>{t(i18n)`Bank Name`}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{entityBankAccount.bank_name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>{t(i18n)`BIC`}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{entityBankAccount.bic}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>{t(i18n)`IBAN`}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{entityBankAccount.iban}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
