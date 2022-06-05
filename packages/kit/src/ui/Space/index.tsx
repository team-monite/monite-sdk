import React from 'react';
import AntSpace, { SpaceProps as AntSpaceProps } from 'antd/es/space/index';
import ConfigProvider from 'antd/es/config-provider';

import './styles.less';

type SpaceProps = AntSpaceProps & {};
const Space = ({ ...rest }: SpaceProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntSpace {...rest} />
    </ConfigProvider>
  );
};

export default Space;
