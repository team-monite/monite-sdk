import React from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  CounterpartAddress,
  CounterpartType,
  ReceivableCounterpartContact,
} from '@monite/sdk-api';
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  Box,
} from '@mui/material';

export type Props = {
  counterpartName?: string;
  counterpartType: CounterpartType.INDIVIDUAL | CounterpartType.ORGANIZATION;
  counterpartContact?: ReceivableCounterpartContact;
  counterpartAddress: CounterpartAddress;
};

export const InvoiceTo = ({
  counterpartName,
  counterpartType,
  counterpartContact,
  counterpartAddress,
}: Props) => {
  const { i18n } = useLingui();

  return (
    <Box mt={2}>
      <Typography variant="subtitle2">{t(i18n)`To`}</Typography>
      <Card variant="outlined">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>
                  {counterpartType === CounterpartType.ORGANIZATION
                    ? counterpartName
                    : `${counterpartContact?.first_name} ${counterpartContact?.last_name}`}
                </Typography>
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
