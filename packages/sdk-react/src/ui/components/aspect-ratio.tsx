import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '@/ui/lib/utils';

interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio: number;
  children: ReactNode;
}

/**
 * AspectRatio component that maintains a specific aspect ratio
 * Uses native CSS aspect-ratio for better performance and compatibility
 * with scaled and transformed content
 */
const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio, children, className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('mtw:w-full', className)}
        style={{
          ...style,
          aspectRatio: ratio.toString(),
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio };
