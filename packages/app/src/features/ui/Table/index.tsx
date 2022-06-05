import React from 'react';
import AntTable, { TableProps as AntTableProps } from 'antd/es/table';
import cn from 'classnames';

import styles from './styles.module.scss';

type ButtonProps = AntTableProps<{}> & {};
const Table = ({ children, className, ...rest }: ButtonProps) => {
  return (
    <AntTable className={cn(styles.table, className)} {...rest}>
      {children}
    </AntTable>
  );
};

export default Table;
