import React from 'react';
import AntList, { ListProps as AntListProps } from 'antd/es/list/index';

import './styles.less';

type ListProps<T> = AntListProps<T> & {};
const List = <T extends any>({ ...rest }: ListProps<T>) => {
  return <AntList {...rest} />;
};

export default List;
