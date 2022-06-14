import React from 'react';
import AntSelect, { SelectProps as AntSelectProps } from 'antd/es/select/index';
import { DownArrowIcon } from '../../ui';

import './styles.less';

type SelectProps = AntSelectProps & {};
const Select = ({ ...rest }: SelectProps) => {
  return (
    <AntSelect
      defaultActiveFirstOption={false}
      suffixIcon={<DownArrowIcon />}
      {...rest}
    />
  );
};

export default Select;
