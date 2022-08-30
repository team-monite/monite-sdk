import React, { FC, forwardRef } from 'react';
import Button, { ButtonProps } from '../Button';

type LinkProps = {
  href: string;
};

const Link: FC<LinkProps & ButtonProps> = forwardRef<
  any,
  LinkProps & ButtonProps
>(({ children, ...props }: LinkProps & ButtonProps, ref) => {
  return (
    <Button ref={ref} size={'sm'} variant={'text'} {...props}>
      {children}
    </Button>
  );
});

export default Link;
