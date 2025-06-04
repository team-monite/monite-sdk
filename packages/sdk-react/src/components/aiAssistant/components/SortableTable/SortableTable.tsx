import { Children, FC, ReactElement, useMemo, useState } from 'react';

import { SortDirection } from '@/components';
import { sortAssistantTable } from '@/components/aiAssistant/utils/tableSort';
import { cn } from '@/ui/lib/utils';

import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface SortableTableProps {
  tbody: ReactElement;
  thead: ReactElement;
}

export const SortableTable: FC<SortableTableProps> = ({ tbody, thead }) => {
  const [sortIndex, setSortIndex] = useState<number>(0);
  const [direction, setDirection] = useState<SortDirection>('asc');

  const [headerRow] = Children.toArray(thead.props.children) as ReactElement[];
  const headerCells = Children.toArray(
    headerRow.props.children
  ) as ReactElement[];
  const bodyRows = Children.toArray(tbody.props.children) as ReactElement[];

  const sortedRows = useMemo(
    () => sortAssistantTable({ bodyRows, sortIndex, direction }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [direction, sortIndex]
  );

  const handleChangeSort = (index: number) => {
    if (sortIndex === index) {
      setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));

      return;
    }

    setSortIndex(index);
    setDirection('asc');
  };

  return (
    <table>
      <thead>
        <tr>
          {headerCells.map(({ props: { children } }, index) => (
            <th key={index} onClick={() => handleChangeSort(index)}>
              <div className="mtw:flex mtw:items-center mtw:gap-1 mtw:cursor-pointer">
                <span className="mtw:text-nowrap">{children}</span>

                <div
                  className={cn(
                    'mtw:flex mtw:items-center mtw:invisible mtw:w-4',
                    sortIndex === index && 'mtw:visible'
                  )}
                >
                  {direction === 'asc' ? (
                    <ArrowUpIcon size={16} />
                  ) : (
                    <ArrowDownIcon size={16} />
                  )}
                </div>
              </div>
            </th>
          ))}
        </tr>
      </thead>

      <tbody>{sortedRows}</tbody>
    </table>
  );
};
