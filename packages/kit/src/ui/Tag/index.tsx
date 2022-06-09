import React from 'react';
import AntTag, { TagProps as AntTagProps } from 'antd/es/tag/index';
import ConfigProvider from 'antd/es/config-provider';
import cn from 'classnames';

import { CloseIcon } from '../Icons';

import './styles.less';

type TagProps = AntTagProps & {
  status?:
    | 'disabled'
    | 'pending'
    | 'draft'
    | 'partially'
    | 'warning'
    | 'success'
    | 'archived';
};
const Tag = ({ color, className, status, ...rest }: TagProps) => {
  return (
    <ConfigProvider prefixCls="monite">
      <AntTag
        className={cn({ [`monite-tag-status-${status}`]: !!status }, className)}
        closeIcon={<CloseIcon />}
        {...rest}
      />
    </ConfigProvider>
  );
};

export default Tag;
