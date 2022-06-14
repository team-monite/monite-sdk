import React from 'react';
import AntForm, { FormProps as AntFormProps } from 'antd/es/form/index';
import ConfigProvider from 'antd/es/config-provider';

import './styles.less';

type FormProps = AntFormProps & {
  children: React.ReactNode;
};
const Form = ({ ...rest }: FormProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntForm {...rest} />
    </ConfigProvider>
  );
};

export default Form;
