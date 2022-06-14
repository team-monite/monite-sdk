import React from 'react';
import AntButton, { ButtonProps as AntButtonProps } from 'antd/es/button';
import cn from 'classnames';

import { Spinner } from '../../ui/Icons';

import './styles.less';

export interface ButtonProps extends AntButtonProps {}

const Button = ({ className, loading, icon, ...otherProps }: ButtonProps) => {
  return (
    <AntButton
      className={cn(className, { 'monite-btn-loading': loading })}
      icon={
        loading ? (
          <span className="monite-btn-spinner">
            <Spinner width={20} height={20} />
          </span>
        ) : (
          icon
        )
      }
      {...otherProps}
    />
  );
};

export default Button;
