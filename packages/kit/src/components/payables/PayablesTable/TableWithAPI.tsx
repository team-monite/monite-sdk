import React, { useState } from 'react';
import { PayableResponseSchema } from '@monite/js-sdk';

// import { useComponentsContext } from '../../../core/context/ComponentsContext';
import Table from './Table';

export interface PayablesTableWithAPIProps {}

const PayablesTableWithAPI = () => {
  const [data] = useState<PayableResponseSchema[]>([]);

  // const { monite } = useComponentsContext() || {};

  // useEffect(() => {
  //   (async () => {
  //     const res = await monite.api!.payables.getList();
  //     setData(
  //       (Array.isArray(res?.data) ? res.data : []).filter((row) => row.id)
  //     );
  //   })();
  // }, [monite]);

  return <Table data={data} />;
};

export default PayablesTableWithAPI;
