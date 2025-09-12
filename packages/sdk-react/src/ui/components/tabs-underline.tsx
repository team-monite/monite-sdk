import { cn } from '@/ui/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { useRef, useLayoutEffect, type ComponentProps } from 'react';

function TabsUnderline({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn('mtw:flex mtw:flex-col mtw:gap-0', className)}
      {...props}
    />
  );
}

function TabsListUnderline({
  className,
  children,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const prevIndexRef = useRef<number>(-1);

  useLayoutEffect(() => {
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
  }, [children]);

  return (
    <TabsPrimitive.List
      ref={listRef}
      data-slot="tabs-list"
      className={cn(
        // Underline tabs container (MUI-style): full-width bottom separator
        'mtw:relative mtw:inline-flex mtw:h-11 mtw:w-full mtw:items-center mtw:justify-start mtw:border-b mtw:border-[#dce2eb] mtw:gap-6',
        className
      )}
      {...props}
    >
      {children}
      <span
        ref={indicatorRef}
        aria-hidden
        className={cn(
          'mtw:absolute mtw:bottom-0 mtw:h-1 mtw:bg-[#3737ff] mtw:rounded-[10px] mtw:transition-[left,width] mtw:duration-200 mtw:ease-out'
        )}
        style={{ left: 0, width: 0 }}
      />
    </TabsPrimitive.List>
  );
}

function TabsTriggerUnderline({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        // Underline tab trigger
        'mtw:relative mtw:inline-flex mtw:h-11 mtw:items-center mtw:justify-center mtw:px-0 mtw:text-[14px] mtw:leading-4 mtw:tracking-[0.21px] mtw:font-medium mtw:text-[#212126] mtw:transition-colors mtw:duration-200 mtw:ease-out mtw:data-[state=active]:font-semibold',
        // Accessibility
        'mtw:focus-visible:outline-none mtw:focus-visible:ring-2 mtw:focus-visible:ring-ring',
        // Disabled
        'mtw:disabled:pointer-events-none mtw:disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}

function TabsContentUnderline({
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

export {
  TabsUnderline,
  TabsListUnderline,
  TabsTriggerUnderline,
  TabsContentUnderline,
  // Export with backward compatible names for easier migration
  TabsUnderline as Tabs,
  TabsListUnderline as TabsList,
  TabsTriggerUnderline as TabsTrigger,
  TabsContentUnderline as TabsContent,
};
