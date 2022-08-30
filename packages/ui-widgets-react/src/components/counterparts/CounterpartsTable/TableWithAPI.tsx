import React, { useEffect, useState } from 'react';
import { CounterpartResponse } from '@monite/sdk-api';

import { useComponentsContext } from '../../../core/context/ComponentsContext';
import Table from './Table';

export interface CounterpartsTableProps {}

const CounterpartsTableWithAPI = () => {
  const [data, setData] = useState<CounterpartResponse[]>([]);

  const { monite } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      const data = await monite.api!.counterparts.getList();
      setData(
        (Array.isArray(data) ? data : []).filter(
          (row) => row.id && row.type && (row as any)[row.type]
        )
      );
    })();
  }, [monite]);

  return <Table data={data} />;
};

export default CounterpartsTableWithAPI;
