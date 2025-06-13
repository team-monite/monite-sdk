import * as React from 'react';

import { cn } from '@/ui/lib/utils';

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'mtw:bg-card mtw:text-card-foreground mtw:flex mtw:flex-col mtw:gap-6 mtw:rounded-xl mtw:border mtw:py-6 mtw:shadow-sm',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'mtw:@container/card-header mtw:grid mtw:auto-rows-min mtw:grid-rows-[auto_auto] mtw:items-start mtw:gap-1.5 mtw:px-6 mtw:has-data-[slot=card-action]:grid-cols-[1fr_auto] mtw:[.border-b]:pb-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('mtw:leading-none mtw:font-semibold', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('mtw:text-muted-foreground mtw:text-sm', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'mtw:col-start-2 mtw:row-span-2 mtw:row-start-1 mtw:self-start mtw:justify-self-end',
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('mtw:px-6', className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'mtw:flex mtw:items-center mtw:px-6 mtw:[.border-t]:pt-6',
        className
      )}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
