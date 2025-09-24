import { cn } from '@/ui/lib/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const buttonVariants = cva(
  'mtw:inline-flex mtw:cursor-pointer mtw:items-center mtw:justify-center mtw:gap-2 mtw:whitespace-nowrap mtw:rounded-md mtw:text-sm mtw:font-medium mtw:transition-all mtw:disabled:pointer-events-none mtw:disabled:opacity-50 mtw:[&_svg]:pointer-events-none mtw:[&_svg:not([class*=size-])]:size-4 mtw:shrink-0 mtw:[&_svg]:shrink-0 mtw:outline-none mtw:focus-visible:border-ring mtw:focus-visible:ring-ring/50 mtw:focus-visible:ring-[3px] mtw:aria-invalid:ring-destructive/20 mtw:dark:aria-invalid:ring-destructive/40 mtw:aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default:
          'mtw:bg-primary mtw:text-primary-foreground mtw:shadow-xs mtw:hover:bg-primary/90',
        destructive:
          'mtw:bg-destructive mtw:text-white mtw:shadow-xs mtw:hover:bg-destructive/90 mtw:focus-visible:ring-destructive/20 mtw:dark:focus-visible:ring-destructive/40 mtw:dark:bg-destructive/60',
        destructiveGhost: 'mtw:text-destructive mtw:hover:bg-destructive/20',
        outline:
          'mtw:border mtw:bg-background mtw:shadow-xs mtw:hover:bg-accent mtw:hover:text-accent-foreground mtw:dark:bg-input/30 mtw:dark:border-input mtw:dark:hover:bg-input/50',
        secondary:
          'mtw:bg-secondary mtw:text-secondary-foreground mtw:shadow-xs mtw:hover:bg-secondary/80',
        ghost:
          'mtw:hover:bg-accent mtw:hover:text-accent-foreground mtw:dark:hover:bg-accent/50',
        link: 'mtw:text-primary mtw:underline-offset-4 mtw:hover:underline',
      },
      size: {
        default: 'mtw:h-9 mtw:px-4 mtw:py-2 mtw:has-[>svg]:px-3',
        sm: 'mtw:h-8 mtw:rounded-md mtw:gap-1.5 mtw:px-3 mtw:has-[>svg]:px-2.5',
        lg: 'mtw:h-10 mtw:rounded-md mtw:px-6 mtw:has-[>svg]:px-4',
        icon: 'mtw:size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export { Button, buttonVariants };
