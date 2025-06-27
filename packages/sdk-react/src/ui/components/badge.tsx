import * as React from 'react';

import { cn } from '@/ui/lib/utils';
import { Slot } from '@radix-ui/react-slot';

import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'mtw:inline-flex mtw:items-center mtw:justify-center mtw:rounded-md mtw:border mtw:px-2 mtw:py-0.5 mtw:text-xs mtw:font-medium mtw:w-fit mtw:whitespace-nowrap mtw:shrink-0 mtw:[&>svg]:size-3 mtw:gap-1 mtw:[&>svg]:pointer-events-none mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:focus-visible:ring-[3px] mtw:aria-invalid:ring-destructive/20 mtw:dark:aria-invalid:ring-destructive/40 mtw:aria-invalid:border-destructive mtw:transition-[color,box-shadow] mtw:overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'mtw:border-transparent mtw:bg-primary mtw:text-primary-foreground mtw:[a&]:hover:bg-primary/90',
        secondary:
          'mtw:border-transparent mtw:bg-secondary mtw:text-secondary-foreground mtw:[a&]:hover:bg-secondary/90',
        destructive:
          'mtw:border-transparent mtw:bg-destructive mtw:text-white mtw:[a&]:hover:bg-destructive/90 mtw:focus-visible:ring-destructive/20 mtw:dark:focus-visible:ring-destructive/40 mtw:dark:bg-destructive/60',
        outline:
          'mtw:text-foreground mtw:[a&]:hover:bg-accent mtw:[a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
