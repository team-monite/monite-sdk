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
        'mtw:flex mtw:flex-row mtw:justify-between mtw:items-center',
        '[&>*]:mtw:flex-basis-fit-content [&>*]:mtw:flex-grow',
        className
      )}
    >
      {searchField}
      <div className="mtw:flex mtw:flex-row mtw:gap-1 mtw:justify-end mtw:items-center mtw:ml-2">
        {children}
      </div>
    </div>
  );
};
