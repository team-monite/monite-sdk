import React from 'react';
import AntInput, { InputProps as AntInputProps } from 'antd/es/input/index';
import ConfigProvider from 'antd/es/config-provider';
import cn from 'classnames';

import './styles.less';

type InputProps = AntInputProps & {};
const Input = ({ className, placeholder, value, ...rest }: InputProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntInput
        className={cn(
          'monite-input-root',
          { 'monite-input-empty': !value && !placeholder },
          className
        )}
        value={value}
        placeholder={placeholder}
        {...rest}
      />
    </ConfigProvider>
  );
};

export default Input;
