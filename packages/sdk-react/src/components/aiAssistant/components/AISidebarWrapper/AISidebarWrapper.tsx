import { cn } from '@/ui/lib/utils';
import type { FC, PropsWithChildren } from 'react';

export const AISidebarWrapper: FC<PropsWithChildren> = ({ children }) => (
  <div
    className={cn(
      'mtw:h-full mtw:w-[300px] mtw:p-4',
      'mtw:border-r mtw:border-sidebar-border mtw:border-solid'
    )}
  >
    {children}
  </div>
);
