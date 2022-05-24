import React, { useEffect, useState } from 'react';

import AntTable, { TableProps as AntTableProps } from 'antd/es/table';

import ConfigProvider from 'antd/es/config-provider';
import { useComponentsContext } from '../../../core/context/ComponentsContext';

import './styles.less';

export interface CounterpartsTableProps extends AntTableProps<any> {}

const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Type',
    dataIndex: 'type',
    key: 'type',
  },
];

const CounterpartsTable = (props: CounterpartsTableProps) => {
  const [data, setData] = useState<any>([]);

  const { api } = useComponentsContext() || {};

  useEffect(() => {
    (async () => {
      const data = await api!.counterparts.getCounterpartsCounterpartsGet();
      setData(data);
    })();
  }, []);

  return (
    <ConfigProvider prefixCls="monite">
      <AntTable dataSource={data} columns={columns} {...props} />
    </ConfigProvider>
  );
};

export default CounterpartsTable;
