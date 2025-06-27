import { components } from '@/api';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';

export const InvoicePaymentDetails = ({
  iban,
  bic,
  bank_name,
}: components['schemas']['ReceivablesRepresentationOfEntityBankAccount']) => {
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
                <Typography>{bank_name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>{t(i18n)`BIC`}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{bic}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>{t(i18n)`IBAN`}</Typography>
              </TableCell>
              <TableCell>
                <Typography>{iban}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
