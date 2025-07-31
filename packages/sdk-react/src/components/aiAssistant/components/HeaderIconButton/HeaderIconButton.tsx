import { cn } from '@/ui/lib/utils';
import React, { type ButtonHTMLAttributes, type FC } from 'react';

interface HeaderIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const HeaderIconButton: FC<HeaderIconButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'mtw:hover:bg-sidebar-accent mtw:p-2 mtw:rounded-md mtw:cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
