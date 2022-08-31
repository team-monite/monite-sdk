import React, { FC, forwardRef } from 'react';
import Button, { ButtonProps } from '../Button';

const IconButton: FC<ButtonProps> = forwardRef<any, ButtonProps>(
  ({ children, ...props }: ButtonProps, ref) => (
    <Button ref={ref} variant={'icon'} isIcon {...props}>
      {children}
    </Button>
  )
);

export default IconButton;
