import { classNames } from '@/utils/css-utils';
import { ReactNode } from 'react';

interface FilterContainerProps {
  className?: string;
  searchField?: ReactNode;
  children: ReactNode;
}

export const FilterContainer = ({
  className,
  searchField,
  children,
}: FilterContainerProps) => {
  return (
    <div
      className={classNames(
        'Monite-Filters mtw:flex mtw:flex-row mtw:justify-between mtw:items-center',
        className
      )}
    >
      <div className="mtw:flex-1 mtw:[&_.Monite-SearchField]:max-w-[400px] mtw:[&_.Monite-SearchField]:w-full">
        {searchField}
      </div>
      <div className="Monite-Filters-Group mtw:flex mtw:flex-row mtw:gap-1 mtw:justify-end mtw:items-center mtw:ml-2 [&_.Monite-FilterControl]:mtw:max-w-[160px] [&_.Monite-FilterControl]:mtw:w-full">
        {children}
      </div>
    </div>
  );
};
