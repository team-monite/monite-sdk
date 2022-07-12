import React, { useEffect, useState } from 'react';
import { WorkflowResponseSchema } from '@monite/js-sdk';

import { useComponentsContext } from '../../../core/context/ComponentsContext';
import Table from './Table';

export interface ApprovalPoliciesTableWithAPIProps {}

const ApprovalPoliciesTableWithAPI = () => {
  const [data, setData] = useState<WorkflowResponseSchema[]>([]);

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      const res = await monite.api!.workflows.getList();
      setData(
        (Array.isArray(res?.data) ? res.data : []).filter((row) => row.id)
      );
    })();
  }, [monite]);

  return <Table data={data} />;
};

export default ApprovalPoliciesTableWithAPI;
