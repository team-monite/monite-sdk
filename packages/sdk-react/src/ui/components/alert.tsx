import { useState, forwardRef } from 'react';

import { Button } from '@/ui/components/button';
import { cn } from '@/ui/lib/utils';

import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

const alertVariants = cva(
  'mtw:relative mtw:w-full mtw:rounded-lg mtw:pl-4 mtw:pt-3 mtw:pr-3 mtw:pb-4 mtw:flex mtw:items-start mtw:gap-4',
  {
    variants: {
      variant: {
        default: 'mtw:bg-background mtw:text-foreground',
        info: 'mtw:bg-blue-50 mtw:text-blue-900 mtw:dark:bg-blue-950 mtw:dark:text-blue-100',
        warning:
          'mtw:bg-yellow-50 mtw:text-yellow-900 mtw:dark:bg-yellow-950 mtw:dark:text-yellow-100',
        error:
          'mtw:bg-red-50 mtw:text-red-900 mtw:dark:bg-red-950 mtw:dark:text-red-100',
        success:
          'mtw:bg-green-50 mtw:text-green-900 mtw:dark:bg-green-950 mtw:dark:text-green-100',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, icon, children, ...props }, ref) => {
    const [isClosed, setIsClosed] = useState(false);

    if (isClosed) return null;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {icon && (
          <div className="mtw:shrink-0 mtw:h-8 mtw:w-8 mtw:mt-1">{icon}</div>
        )}
        <div className="mtw:flex-1">{children}</div>
        <Button
          variant="ghost"
          size="icon"
          className="mtw:h-8 mtw:w-8 mtw:rounded-md mtw:bg-transparent mtw:opacity-70 mtw:hover:opacity-100"
          onClick={() => setIsClosed(true)}
          aria-label="Close alert"
        >
          <X />
        </Button>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mtw:mb-1 mtw:text-lg mtw:font-medium mtw:leading-none mtw:tracking-tight',
      className
    )}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'mtw:text-sm mtw:[&_p]:leading-relaxed mtw:font-normal',
      className
    )}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription, alertVariants };
