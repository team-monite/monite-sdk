import * as React from 'react';

import { cn } from '@/ui/lib/utils';

import { cva, type VariantProps } from 'class-variance-authority';

const alertVariants = cva(
  'mtw:relative mtw:w-full mtw:rounded-lg mtw:border mtw:px-4 mtw:py-3 mtw:text-sm mtw:grid has-[>svg]:mtw:grid-cols-[calc(var(--spacing)*4)_1fr] mtw:grid-cols-[0_1fr] has-[>svg]:mtw:gap-x-3 mtw:gap-y-0.5 mtw:items-start [&>svg]:mtw:size-4 [&>svg]:mtw:translate-y-0.5 [&>svg]:mtw:text-current',
  {
    variants: {
      variant: {
        default: 'mtw:bg-card mtw:text-card-foreground',
        destructive:
          'mtw:text-destructive mtw:bg-card [&>svg]:mtw:text-current *:data-[slot=alert-description]:mtw:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'mtw:col-start-2 mtw:line-clamp-1 mtw:min-h-4 mtw:font-medium mtw:tracking-tight',
        className
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'mtw:text-muted-foreground mtw:col-start-2 mtw:grid mtw:justify-items-start mtw:gap-1 mtw:text-sm [&_p]:mtw:leading-relaxed',
        className
      )}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
