import { cn } from '@/ui/lib/utils';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { ComponentProps } from 'react';

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'mtw:bg-border mtw:shrink-0 mtw:data-[orientation=horizontal]:h-px mtw:data-[orientation=horizontal]:w-full mtw:data-[orientation=vertical]:h-full mtw:data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  );
}

export { Separator };
