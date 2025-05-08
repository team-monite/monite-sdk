import React, { type ButtonHTMLAttributes, type FC } from 'react';

import { cn } from '@/ui/lib/utils';

interface AISidebarIconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const AISidebarIconButton: FC<AISidebarIconButtonProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(
        'mtw:hover:bg-sidebar-accent mtw:p-1 mtw:rounded mtw:cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
