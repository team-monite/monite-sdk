import React from 'react';
import { Table, TableCell } from '@monite/ui';
import { WorkflowResponseSchema } from '@monite/js-sdk';

import { useComponentsContext } from 'core/context/ComponentsContext';

import Row from './Row';

interface TableProps {
  data?: WorkflowResponseSchema[];
}

const ApprovalPoliciesTable = ({ data }: TableProps) => {
  const { t } = useComponentsContext();

  return (
    <Table>
      <thead>
        <tr>
          <TableCell forHeader>
            {t('approvalPolicies:columns.policyName')}
          </TableCell>
          <TableCell forHeader>
            {t('approvalPolicies:columns.status')}
          </TableCell>
          <TableCell forHeader>
            {t('approvalPolicies:columns.createdBy')}
          </TableCell>
          <TableCell forHeader>{t('approvalPolicies:columns.date')}</TableCell>
          <TableCell forHeader>{t('approvalPolicies:columns.rules')}</TableCell>
        </tr>
      </thead>
      <tbody>
        {(data || []).map((row) => (
          <Row key={row.id} row={row} />
        ))}
      </tbody>
    </Table>
  );
};

export default ApprovalPoliciesTable;
