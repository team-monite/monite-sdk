import React from 'react';
import AntForm, { FormItemProps as AntFormItemProps } from 'antd/es/form/index';
import ConfigProvider from 'antd/es/config-provider';

import './styles.less';

type InputProps = AntFormItemProps & {};
const FormItem = ({ ...rest }: InputProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntForm.Item colon={false} {...rest} />
    </ConfigProvider>
  );
};

export default FormItem;
