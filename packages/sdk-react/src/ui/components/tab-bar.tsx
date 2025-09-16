import { Separator } from './separator';
import { cn } from '@/ui/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { ComponentProps, forwardRef, ElementRef } from 'react';

interface TabBarProps extends ComponentProps<typeof TabsPrimitive.Root> {
  className?: string;
}

interface TabBarListProps extends ComponentProps<typeof TabsPrimitive.List> {
  className?: string;
}

interface TabBarTriggerProps
  extends ComponentProps<typeof TabsPrimitive.Trigger> {
  className?: string;
}

interface TabBarContentProps
  extends ComponentProps<typeof TabsPrimitive.Content> {
  className?: string;
}

const TabBar = forwardRef<ElementRef<typeof TabsPrimitive.Root>, TabBarProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Root
      ref={ref}
      data-slot="tab-bar"
      className={cn('mtw:flex mtw:flex-col mtw:gap-2 mtw:relative', className)}
      {...props}
    />
  )
);
TabBar.displayName = 'TabBar';

const TabBarList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  TabBarListProps
>(({ className, ...props }, ref) => (
  <div className="mtw:relative">
    <TabsPrimitive.List
      ref={ref}
      data-slot="tab-bar-list"
      className={cn(
        'mtw:flex mtw:gap-6 mtw:items-center mtw:justify-start mtw:relative',
        className
      )}
      {...props}
    />
    {/* Bottom separator line */}
    <Separator className="mtw:absolute mtw:bottom-0 mtw:left-0 mtw:right-0 mtw:bg-border" />
  </div>
));
TabBarList.displayName = 'TabBarList';

const TabBarTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  TabBarTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tab-bar-trigger"
    className={cn(
      'mtw:group mtw:flex mtw:flex-col mtw:gap-2 mtw:h-11 mtw:items-center mtw:justify-center mtw:relative mtw:rounded-t-md mtw:shrink-0 mtw:px-3 mtw:py-2 mtw:transition-colors mtw:focus-visible:outline-none mtw:focus-visible:ring-2 mtw:focus-visible:ring-ring mtw:focus-visible:ring-offset-2 mtw:disabled:pointer-events-none mtw:disabled:opacity-50',
      'mtw:data-[state=active]:text-foreground mtw:data-[state=inactive]:text-muted-foreground',
      'mtw:hover:text-foreground mtw:hover:bg-gray-50',
      className
    )}
    {...props}
  >
    <div className="mtw:flex mtw:gap-3 mtw:items-center mtw:justify-start mtw:relative mtw:shrink-0">
      <div className="mtw:flex mtw:gap-2 mtw:items-center mtw:justify-start mtw:relative mtw:shrink-0">
        <div className="mtw:font-medium mtw:leading-[16px] mtw:not-italic mtw:relative mtw:shrink-0 mtw:text-[14px] mtw:text-nowrap mtw:tracking-[0.21px]">
          {props.children}
        </div>
      </div>
    </div>
    {/* Active indicator - blue bottom line */}
    <div
      aria-hidden="true"
      className="mtw:absolute mtw:bg-primary mtw:bottom-0 mtw:h-1 mtw:left-0 mtw:right-0 mtw:rounded-t-lg mtw:opacity-0 mtw:group-data-[state=active]:opacity-100 mtw:transition-opacity"
    />
  </TabsPrimitive.Trigger>
));
TabBarTrigger.displayName = 'TabBarTrigger';

const TabBarContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  TabBarContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    data-slot="tab-bar-content"
    className={cn('mtw:flex-1 mtw:outline-none', className)}
    {...props}
  />
));
TabBarContent.displayName = 'TabBarContent';

export { TabBar, TabBarList, TabBarTrigger, TabBarContent };
