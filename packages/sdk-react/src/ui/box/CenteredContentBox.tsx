import { cn } from '@/ui/lib/utils';

export const CenteredContentBox = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      'mtw:flex mtw:items-center mtw:justify-center mtw:h-full mtw:w-full',
      className
    )}
  >
    {children}
  </div>
);
