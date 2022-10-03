import React from 'react';
import { format, parseISO } from 'date-fns';
import { Table } from '@team-monite/ui-kit-react';
import { WorkflowResponseSchema } from '@team-monite/sdk-api';

import { useComponentsContext } from 'core/context/ComponentsContext';

interface TableProps {
  data?: WorkflowResponseSchema[];
}

const ApprovalPoliciesTable = ({ data }: TableProps) => {
  const { t } = useComponentsContext();

  const prepareDataForTable = () => {
    // TODO: add user info https://gemms.atlassian.net/browse/DEV-2800
    return (data || []).map((item) => ({
      key: item.id,
      policy_name: item.policy_name,
      status: '—',
      created_by_entity_user_id: item.created_by_entity_user_id,
      created_at: format(parseISO(item.created_at), 'dd.MM.yyyy'),
      rules: '—',
    }));
  };

  return (
    <Table
      columns={[
        {
          title: t('approvalPolicies:columns.policyName'),
          dataIndex: 'policy_name',
          key: 'policy_name',
        },
        {
          title: t('approvalPolicies:columns.status'),
          dataIndex: 'status',
          key: 'status',
        },
        {
          title: t('approvalPolicies:columns.createdBy'),
          dataIndex: 'created_by_entity_user_id',
          key: 'created_by_entity_user_id',
        },
        {
          title: t('approvalPolicies:columns.date'),
          dataIndex: 'created_at',
          key: 'created_at',
        },
        {
          title: t('approvalPolicies:columns.rules'),
          dataIndex: 'rules',
          key: 'rules',
        },
      ]}
      data={prepareDataForTable()}
    />
  );
};

export default ApprovalPoliciesTable;
