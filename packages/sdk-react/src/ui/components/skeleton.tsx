import { cn } from '@/ui/lib/utils';

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'mtw:bg-accent mtw:animate-pulse mtw:rounded-md',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
