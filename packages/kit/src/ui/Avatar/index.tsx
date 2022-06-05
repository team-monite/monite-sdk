import React from 'react';
import AntAvatar, { AvatarProps as AntAvatarProps } from 'antd/es/avatar';
import ConfigProvider from 'antd/es/config-provider';

import './styles.less';

type AvatarProps = AntAvatarProps & {};
const Avatar = ({ ...otherProps }: AvatarProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntAvatar {...otherProps} />
    </ConfigProvider>
  );
};

export default Avatar;
