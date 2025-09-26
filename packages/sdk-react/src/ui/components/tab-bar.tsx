import { cn } from '@/ui/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import {
  ComponentProps,
  forwardRef,
  ElementRef,
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  type CSSProperties,
} from 'react';

interface TabBarProps extends ComponentProps<typeof TabsPrimitive.Root> {
  className?: string;
}

interface TabBarListProps extends ComponentProps<typeof TabsPrimitive.List> {
  className?: string;
  /**
   * Whether to animate the sliding indicator under the active tab.
   * @default true
   */
  animateIndicator?: boolean;
  /**
   * Additional classes for the sliding indicator.
   */
  indicatorClassName?: string;
  /**
   * Inline styles applied to the sliding indicator.
   */
  indicatorStyle?: CSSProperties;
  /**
   * Classes for the bottom separator line.
   */
  separatorClassName?: string;
  /**
   * Whether to render the bottom separator line.
   * @default true
   */
  showSeparator?: boolean;
  /**
   * Optional class applied to the container wrapping the list. Useful for spacing.
   */
  gapClassName?: string;
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
      className={cn('mtw:flex mtw:flex-col mtw:gap-0 mtw:relative', className)}
      {...props}
    />
  )
);
TabBar.displayName = 'TabBar';

const TabBarList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  TabBarListProps
>(
  (
    {
      className,
      children,
      animateIndicator = true,
      indicatorClassName = 'mtw:bg-primary',
      indicatorStyle,
      separatorClassName = 'mtw:bg-border',
      showSeparator = true,
      gapClassName,
      ...props
    },
    ref
  ) => {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const prevIndexRef = useRef<number>(-1);

  useImperativeHandle(ref, () => listRef.current as HTMLDivElement);

  useLayoutEffect(() => {
    if (!animateIndicator) return;

    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;

    const getIndexOf = (el: Element | null) =>
      el
        ? Array.from(list.querySelectorAll('[role="tab"]')).indexOf(
            el as HTMLElement
          )
        : -1;

    const update = () => {
      const active = list.querySelector<HTMLElement>('[data-state="active"]');
      const index = getIndexOf(active);
      if (!active || index === -1) return;

      const listRect = list.getBoundingClientRect();
      const rect = active.getBoundingClientRect();
      const left = rect.left - listRect.left;
      const width = rect.width;

      const prev = prevIndexRef.current;
      list.setAttribute(
        'data-slide-dir',
        prev !== -1 && index < prev ? 'backward' : 'forward'
      );
      prevIndexRef.current = index;

      indicator.style.left = `${left}px`;
      indicator.style.width = `${width}px`;
    };

    update();

    const mo = new MutationObserver(update);
    mo.observe(list, {
      attributes: true,
      subtree: true,
      attributeFilter: ['data-state'],
    });
    window.addEventListener('resize', update);

    return () => {
      mo.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [children, animateIndicator]);

  return (
    <div className={cn('mtw:relative', gapClassName)}>
      <TabsPrimitive.List
        ref={listRef}
        data-slot="tab-bar-list"
        className={cn(
          'mtw:flex mtw:gap-6 mtw:items-center mtw:justify-start mtw:relative mtw:h-11',
          className
        )}
        {...props}
      >
        {children}
        {/* Animated sliding indicator */}
        {animateIndicator && (
          <span
            ref={indicatorRef}
            aria-hidden="true"
            className={cn(
              'mtw:absolute mtw:bottom-0 mtw:h-1 mtw:rounded-t-lg mtw:transition-[left,width] mtw:duration-200 mtw:ease-out',
              indicatorClassName
            )}
            style={{ left: 0, width: 0, ...indicatorStyle }}
          />
        )}
      </TabsPrimitive.List>
      {/* Bottom separator line */}
      {showSeparator && (
        <div
          className={cn(
            'mtw:absolute mtw:bottom-0 mtw:left-0 mtw:right-0 mtw:h-px',
            separatorClassName
          )}
        />
      )}
    </div>
  );
}
);
TabBarList.displayName = 'TabBarList';

const TabBarTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  TabBarTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-slot="tab-bar-trigger"
    className={cn(
      'mtw:relative mtw:inline-flex mtw:h-11 mtw:items-center mtw:justify-center mtw:px-0 mtw:text-[14px] mtw:leading-4 mtw:tracking-[0.21px] mtw:font-medium mtw:text-foreground mtw:transition-colors mtw:duration-200 mtw:ease-out',
      'mtw:data-[state=active]:font-semibold mtw:data-[state=inactive]:text-muted-foreground',
      // Accessibility
      'mtw:focus-visible:outline-none mtw:focus-visible:ring-2 mtw:focus-visible:ring-ring',
      // Disabled
      'mtw:disabled:pointer-events-none mtw:disabled:opacity-50',
      className
    )}
    {...props}
  />
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

// Backward-compatible exports for easier migration from tabs-underline.tsx
export {
  TabBar as Tabs,
  TabBarList as TabsList,
  TabBarTrigger as TabsTrigger,
  TabBarContent as TabsContent,
};
