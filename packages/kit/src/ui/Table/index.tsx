import React from 'react';
import AntTable, { TableProps as AntTableProps } from 'antd/es/table';
import ConfigProvider from 'antd/es/config-provider';

import './styles.less';

export { ColumnsType } from 'antd/es/table';

export type TableProps<RecordType> = AntTableProps<RecordType> & {};
const Table = <RecordType extends object = any>({
  ...otherProps
}: TableProps<RecordType>) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntTable {...otherProps} />
    </ConfigProvider>
  );
};

export default Table;
