import React from 'react';
import AntSelect, { OptionProps as AntOptionProps } from 'antd/es/select/index';

import './styles.less';

type SelectOptionProps = AntOptionProps & {};
const SelectOption = ({ children, ...rest }: SelectOptionProps) => {
  return <AntSelect.Option {...rest}>{children}</AntSelect.Option>;
};

export default SelectOption;
