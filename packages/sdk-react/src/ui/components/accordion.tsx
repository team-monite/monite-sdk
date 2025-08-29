import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as AccordionPrimitive from '@radix-ui/react-accordion';

import { ChevronDownIcon } from 'lucide-react';

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('mtw:border-b mtw:last:border-b-0', className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="mtw:flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:flex mtw:flex-1 mtw:items-start mtw:justify-between mtw:gap-4 mtw:rounded-md mtw:py-4 mtw:text-left mtw:text-sm mtw:font-medium mtw:transition-all mtw:outline-none mtw:hover:underline mtw:focus-visible:ring-[3px] mtw:disabled:pointer-events-none mtw:disabled:opacity-50 mtw:[&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="mtw:text-muted-foreground mtw:pointer-events-none mtw:size-4 mtw:shrink-0 mtw:translate-y-0.5 mtw:transition-transform mtw:duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="mtw:data-[state=closed]:animate-accordion-up mtw:data-[state=open]:animate-accordion-down mtw:overflow-hidden mtw:text-sm"
      {...props}
    >
      <div className={cn('mtw:pt-0 mtw:pb-4', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
