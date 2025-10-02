import { twMerge } from 'tailwind-merge';

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'mtw:w-8 mtw:h-8 mtw:rounded-full mtw:border-3 mtw:border-primary mtw:border-t-transparent mtw:animate-spin',
        className
      )}
    />
  );
};
