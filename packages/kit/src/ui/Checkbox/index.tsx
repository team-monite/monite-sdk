import React from 'react';

import ConfigProvider from 'antd/es/config-provider';
import AntCheckbox, {
  CheckboxProps as AntCheckboxProps,
} from 'antd/es/checkbox';

import './styles.less';

type CheckboxProps = AntCheckboxProps & {};
const Checkbox = ({ ...rest }: CheckboxProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntCheckbox {...rest} />
    </ConfigProvider>
  );
};

export default Checkbox;
