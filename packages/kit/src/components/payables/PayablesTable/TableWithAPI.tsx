import React, { useState, useEffect } from 'react';
import { ReceivableResponse } from '@monite/js-sdk';

import { useComponentsContext } from '../../../core/context/ComponentsContext';
import Table from './Table';

const PayablesTableWithAPI = () => {
  const [data, setData] = useState<ReceivableResponse[]>([]);

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      const res = await monite.api!.payables.getList();
      setData(
        (Array.isArray(res?.data) ? res.data : []).filter((row) => row.id)
      );
    })();
  }, [monite]);

  return <Table data={data} />;
};

export default PayablesTableWithAPI;
