import React from 'react';
import { format, parseISO } from 'date-fns';
import { TableRow } from '@monite/ui';
import { WorkflowResponseSchema } from '@monite/js-sdk';
import styled from '@emotion/styled';

interface RowProps {
  row: WorkflowResponseSchema;
}

const Col = styled.div`
  width: 0;
  min-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// TODO: adduser info https://gemms.atlassian.net/browse/DEV-2800
const Row = ({ row }: RowProps) => {
  return (
    <TableRow>
      <td>
        <Col>{row.policy_name}</Col>
      </td>
      <td>
        <Col>—</Col>
      </td>
      <td>
        <Col>{row.created_by_entity_user_id}</Col>
      </td>
      <td>
        <Col>{format(parseISO(row.created_at), 'dd.MM.yyyy')}</Col>
      </td>
      <td>
        <Col>—</Col>
      </td>
    </TableRow>
  );
};

export default Row;
