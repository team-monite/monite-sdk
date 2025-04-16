import { FC, LiHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/ui/lib/utils';

interface SidebarMenuButtonProps extends LiHTMLAttributes<HTMLLIElement> {
  isActive?: boolean;
  className?: string;
  children: ReactNode;
}

export const SidebarMenuItem: FC<SidebarMenuButtonProps> = ({
  isActive = false,
  className,
  children,
  ...props
}) => {
  return (
    <li
      className={cn(
        'mtw:w-full mtw:px-7 mtw:py-2 mtw:align-middle mtw:flex mtw:gap-2 mtw:items-center',
        'mtw:hover:bg-sidebar-accent mtw:hover:text-sidebar-accent-foreground mtw:text-start',
        'mtw:focus-visible:ring-2 mtw:active:bg-sidebar-accent mtw:active:text-sidebar-accent-foreground',
        isActive &&
          'mtw:font-medium mtw:text-sidebar-accent-foreground mtw:bg-sidebar-accent',
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
};
