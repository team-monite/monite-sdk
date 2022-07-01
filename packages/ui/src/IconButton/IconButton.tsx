import React, { FC, forwardRef } from 'react';
import Button, { ButtonProps } from '../Button';

const IconButton: FC<ButtonProps> = forwardRef<any, ButtonProps>(
  ({ children, ...props }: ButtonProps, ref) => {
    return (
      <Button ref={ref} variant={'text'} isIcon {...props}>
        {children}
      </Button>
    );
  }
);

export default IconButton;
