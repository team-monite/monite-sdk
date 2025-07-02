import * as React from 'react';

import { cn } from '@/ui/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'mtw:file:text-foreground mtw:placeholder:text-muted-foreground mtw:selection:bg-primary mtw:selection:text-primary-foreground mtw:dark:bg-input/30 mtw:border-input mtw:flex mtw:h-9 mtw:w-full mtw:min-w-0 mtw:rounded-md mtw:border mtw:bg-transparent mtw:px-3 mtw:py-1 mtw:text-base mtw:shadow-xs mtw:transition-[color,box-shadow] mtw:outline-none mtw:file:inline-flex mtw:file:h-7 mtw:file:border-0 mtw:file:bg-transparent mtw:file:text-sm mtw:file:font-medium mtw:disabled:pointer-events-none mtw:disabled:cursor-not-allowed mtw:disabled:opacity-50 mtw:md:text-sm',
        'mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:focus-visible:ring-[3px]',
        'mtw:aria-invalid:ring-destructive/20 mtw:dark:aria-invalid:ring-destructive/40 mtw:aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  );
}

export { Input };
