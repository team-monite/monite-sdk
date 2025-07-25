import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as LabelPrimitive from '@radix-ui/react-label';

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'mtw:flex mtw:items-center mtw:gap-2 mtw:text-sm mtw:leading-none mtw:font-medium mtw:select-none mtw:group-data-[disabled=true]:pointer-events-none mtw:group-data-[disabled=true]:opacity-50 mtw:peer-disabled:cursor-not-allowed mtw:peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

export { Label };
