import React from 'react';
import AntList, { ListItemProps as AntListItemProps } from 'antd/es/list/index';

import './styles.less';

type ListItemProps = AntListItemProps & {};
const ListItem = ({ ...rest }: ListItemProps) => {
  return <AntList.Item {...rest} />;
};

export default ListItem;
