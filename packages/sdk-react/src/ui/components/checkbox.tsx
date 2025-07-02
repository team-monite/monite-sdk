import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

import { CheckIcon } from 'lucide-react';

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'mtw:peer mtw:border-input mtw:dark:bg-input/30 mtw:data-[state=checked]:bg-primary mtw:data-[state=checked]:text-primary-foreground mtw:dark:data-[state=checked]:bg-primary mtw:data-[state=checked]:border-primary mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:aria-invalid:ring-destructive/20 mtw:dark:aria-invalid:ring-destructive/40 mtw:aria-invalid:border-destructive mtw:size-4 mtw:shrink-0 mtw:rounded-[4px] mtw:border mtw:shadow-xs mtw:transition-shadow mtw:outline-none mtw:focus-visible:ring-[3px] mtw:disabled:cursor-not-allowed mtw:disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="mtw:flex mtw:items-center mtw:justify-center mtw:text-current mtw:transition-none"
      >
        <CheckIcon className="mtw:size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
