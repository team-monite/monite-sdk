import React from 'react';
import { format, parseISO } from 'date-fns';
import { TableRow, TableCell } from '@monite/ui';
import { WorkflowResponseSchema } from '@monite/js-sdk';

interface RowProps {
  row: WorkflowResponseSchema;
}

// TODO: adduser info https://gemms.atlassian.net/browse/DEV-2800
const Row = ({ row }: RowProps) => {
  return (
    <TableRow>
      <TableCell>{row.policy_name}</TableCell>
      <TableCell>—</TableCell>
      <TableCell>{row.created_by_entity_user_id}</TableCell>
      <TableCell>{format(parseISO(row.created_at), 'dd.MM.yyyy')}</TableCell>
      <TableCell>—</TableCell>
    </TableRow>
  );
};

export default Row;
