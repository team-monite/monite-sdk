import { cn } from '@/ui/lib/utils';

export const PromptListSkeleton = () => {
  return (
    <div className="mtw:size-full">
      <div
        className={cn(
          'mtw:lg:w-2xl mtw:md:w-md mtw:sm:w-sm mtw:w-xs mtw:mx-auto',
          'mtw:grid mtw:grid-cols-1 mtw:sm:grid-cols-2 mtw:lg:grid-cols-3 mtw:gap-4 mtw:animate-pulse'
        )}
      >
        <div className="mtw:h-[87px] mtw:bg-gray-200 mtw:rounded-xl" />

        <div className="mtw:h-[87px] mtw:bg-gray-200 mtw:rounded-xl" />

        <div className="mtw:h-[87px] mtw:bg-gray-200 mtw:rounded-xl" />
      </div>
    </div>
  );
};
