import React from 'react';

import { cn } from '@/ui/lib/utils';

export const LoaderDots = () => {
  return (
    <div className="relative">
      <div
        className={cn(
          'mtw:relative mtw:left-[-9985px] mtw:top-1/2 mtw:-translate-y-1/2 mtw:w-2.5 mtw:h-2.5',
          'mtw:rounded-full mtw:bg-primary-80 mtw:text-primary-80',
          'mtw:shadow-[9984px_0_0_0_#9880ff,9999px_0_0_0_#9880ff,10014px_0_0_0_#9880ff] animate-dot-typing'
        )}
      />
    </div>
  );
};
