import type { FC, PropsWithChildren } from 'react';

import { useIsMobile } from '@/core/hooks/useMobile';
import { cn } from '@/ui/lib/utils';

interface AISidebarWrapperProps extends PropsWithChildren {
  open: boolean;
}

export const AISidebarWrapper: FC<AISidebarWrapperProps> = ({
  children,
  open,
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'mtw:h-full mtw:w-[300px]',
        'mtw:border mtw:border-sidebar-border mtw:border-t-0 mtw:border-solid',
        'mtw:duration-300 mtw:transition-[width] mtw:ease-linear',
        'mtw:absolute mtw:bg-white mtw:right-0 mtw:hidden mtw:mb-5',
        !open &&
          'mtw:w-[136px] mtw:border-none mtw:bg-transparent mtw:xl:bg-white',
        'mtw:xl:relative mtw:xl:bg-white mtw:md:block',
        isMobile && 'mtw:block'
      )}
    >
      <div
        className={cn(
          'mtw:fixed mtw:inset-y-[85px] mtw:h-[calc(100vh-105px)] mtw:pt-7 mtw:px-2 mtw:mb-5',
          'mtw:transition-[width] mtw:ease-linear mtw:duration-300 mtw:z-10',
          'mtw:flex mtw:flex-col mtw:gap-4 mtw:w-[300px] mtw:right-0',
          !open && 'mtw:w-[136px]'
        )}
      >
        {children}
      </div>
    </div>
  );
};
