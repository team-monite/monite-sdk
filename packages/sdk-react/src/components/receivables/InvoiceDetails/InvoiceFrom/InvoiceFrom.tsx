import React from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  EntityAddressSchema,
  ReceivablesEntityIndividual,
  ReceivablesEntityOrganization,
} from '@monite/sdk-api';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';

export type Props = {
  entity: ReceivablesEntityIndividual | ReceivablesEntityOrganization;
  entityAddress: EntityAddressSchema;
};

export const InvoiceFrom = ({ entity, entityAddress }: Props) => {
  const { i18n } = useLingui();

  return (
    <Box mt={2}>
      <Typography variant="subtitle2">{t(i18n)`From`}</Typography>
      <Card variant="outlined">
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography>
                  {entity.type ===
                  ReceivablesEntityOrganization.type.ORGANIZATION
                    ? entity.name
                    : `${entity.first_name} ${entity.last_name}`}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography>
                  {entityAddress.line1}
                  <br />
                  {entityAddress.line2}
                  <br />
                  {entityAddress.city}
                  <br />
                  {entityAddress.postal_code}
                  <br />
                  {entityAddress.state}
                  <br />
                  {entityAddress.country}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
};
