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
        'mtw:absolute mtw:bg-white mtw:right-0 mtw:hidden',
        !open &&
          'mtw:w-[136px] mtw:border-none mtw:bg-transparent mtw:xl:bg-white',
        'mtw:xl:relative mtw:xl:bg-white mtw:md:block',
        isMobile && 'mtw:block'
      )}
    >
      <div
        className={cn(
          'mtw:fixed mtw:inset-y-[85px] mtw:h-full mtw:py-7 mtw:z-10 mtw:w-[300px] mtw:right-0',
          'mtw:transition-[width] mtw:ease-linear mtw:duration-300',
          'mtw:flex mtw:flex-col mtw:gap-4',
          !open && 'mtw:w-[136px]'
        )}
      >
        {children}
      </div>
    </div>
  );
};
