import { cn } from '@/ui/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type ComponentProps } from 'react';

function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('mtw:flex mtw:flex-col mtw:gap-2', className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'mtw:bg-muted mtw:text-muted-foreground mtw:inline-flex mtw:h-9 mtw:w-fit mtw:items-center mtw:justify-center mtw:rounded-lg mtw:p-[3px]',
        className
      )}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'mtw:data-[state=active]:bg-background mtw:dark:data-[state=active]:text-foreground mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:focus-visible:outline-ring mtw:dark:data-[state=active]:border-input mtw:dark:data-[state=active]:bg-input/30 mtw:text-foreground mtw:dark:text-muted-foreground mtw:inline-flex mtw:h-[calc(100%-1px)] mtw:flex-1 mtw:items-center mtw:justify-center mtw:gap-1.5 mtw:rounded-md mtw:border mtw:border-transparent mtw:px-2 mtw:py-1 mtw:text-sm mtw:font-medium mtw:whitespace-nowrap mtw:transition-[color,box-shadow] mtw:focus-visible:ring-[3px] mtw:focus-visible:outline-1 mtw:disabled:pointer-events-none mtw:disabled:opacity-50 mtw:data-[state=active]:shadow-sm mtw:[&_svg]:pointer-events-none mtw:[&_svg]:shrink-0 mtw:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('mtw:flex-1 mtw:outline-none', className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
