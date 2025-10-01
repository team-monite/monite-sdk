import { cn } from '@/ui/lib/utils';
import type { HTMLAttributes } from 'react';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  /** Size of the spinner */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * A loading spinner component with customizable size.
 *
 * @example
 * ```tsx
 * <Spinner size="md" />
 * <Spinner size="lg" className="text-blue-500" />
 * ```
 */
export function Spinner({ className, size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'mtw:h-4 mtw:w-4 mtw:border',
    md: 'mtw:h-6 mtw:w-6 mtw:border-2',
    lg: 'mtw:h-8 mtw:w-8 mtw:border-2',
  };

  return (
    <div
      className={cn(
        'mtw:animate-spin mtw:rounded-full mtw:border-gray-300 mtw:border-t-gray-500',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="mtw:sr-only">Loading...</span>
    </div>
  );
}
