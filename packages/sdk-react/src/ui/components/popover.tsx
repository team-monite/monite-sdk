import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as PopoverPrimitive from '@radix-ui/react-popover';

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

const PopoverTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Trigger>,
  React.ComponentProps<typeof PopoverPrimitive.Trigger>
>(({ ...props }, ref) => {
  return (
    <PopoverPrimitive.Trigger
      data-slot="popover-trigger"
      ref={ref}
      {...props}
    />
  );
});

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'mtw:bg-popover mtw:text-popover-foreground mtw:data-[state=open]:animate-in mtw:data-[state=closed]:animate-out mtw:data-[state=closed]:fade-out-0 mtw:data-[state=open]:fade-in-0 mtw:data-[state=closed]:zoom-out-95 mtw:data-[state=open]:zoom-in-95 mtw:data-[side=bottom]:slide-in-from-top-2 mtw:data-[side=left]:slide-in-from-right-2 mtw:data-[side=right]:slide-in-from-left-2 mtw:data-[side=top]:slide-in-from-bottom-2 mtw:z-50 mtw:w-72 mtw:origin-(--radix-popover-content-transform-origin) mtw:rounded-md mtw:border mtw:p-4 mtw:shadow-md mtw:outline-hidden',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
