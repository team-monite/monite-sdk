import React from 'react';
import { Table } from '@monite/ui';
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
          <th>{t('approvalPolicies:columns.policyName')}</th>
          <th>{t('approvalPolicies:columns.status')}</th>
          <th>{t('approvalPolicies:columns.createdBy')}</th>
          <th>{t('approvalPolicies:columns.date')}</th>
          <th>{t('approvalPolicies:columns.rules')}</th>
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
