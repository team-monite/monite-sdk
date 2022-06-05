import React from 'react';
import AntTag, { TagProps as AntTagProps } from 'antd/es/tag/index';
import ConfigProvider from 'antd/es/config-provider';

import './styles.less';

type TagProps = AntTagProps & {};
const Tag = ({ ...rest }: TagProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntTag {...rest} />
    </ConfigProvider>
  );
};

export default Tag;
