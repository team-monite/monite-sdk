import React from 'react';

import ConfigProvider from 'antd/es/config-provider';
import AntButton, { ButtonProps as AntButtonProps } from 'antd/es/button';

import './styles.less';

export interface ButtonProps extends AntButtonProps {}

const Button = (props: ButtonProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntButton {...props} />
    </ConfigProvider>
  );
};

export default Button;
