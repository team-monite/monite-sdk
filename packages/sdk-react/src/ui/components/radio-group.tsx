import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';

import { CircleIcon } from 'lucide-react';

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('mtw:grid mtw:gap-3', className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'mtw:border-input mtw:text-primary mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:aria-invalid:ring-destructive/20 mtw:dark:aria-invalid:ring-destructive/40 mtw:aria-invalid:border-destructive mtw:dark:bg-input/30 mtw:aspect-square mtw:size-4 mtw:shrink-0 mtw:rounded-full mtw:border mtw:shadow-xs mtw:transition-[color,box-shadow] mtw:outline-none mtw:focus-visible:ring-[3px] mtw:disabled:cursor-not-allowed mtw:disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="mtw:relative mtw:flex mtw:items-center mtw:justify-center"
      >
        <CircleIcon className="mtw:fill-primary mtw:absolute mtw:top-1/2 mtw:left-1/2 mtw:size-2 mtw:-translate-x-1/2 mtw:-translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
