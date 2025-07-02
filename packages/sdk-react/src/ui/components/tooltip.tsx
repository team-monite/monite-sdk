import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'mtw:bg-primary mtw:text-primary-foreground mtw:animate-in mtw:fade-in-0 mtw:zoom-in-95 mtw:data-[state=closed]:animate-out mtw:data-[state=closed]:fade-out-0 mtw:data-[state=closed]:zoom-out-95 mtw:data-[side=bottom]:slide-in-from-top-2 mtw:data-[side=left]:slide-in-from-right-2 mtw:data-[side=right]:slide-in-from-left-2 mtw:data-[side=top]:slide-in-from-bottom-2 mtw:z-50 mtw:w-fit mtw:origin-(--radix-tooltip-content-transform-origin) mtw:rounded-md mtw:px-3 mtw:py-1.5 mtw:text-xs mtw:text-balance',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="mtw:bg-primary mtw:fill-primary mtw:z-50 mtw:size-2.5 mtw:translate-y-[calc(-50%_-_2px)] mtw:rotate-45 mtw:rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
