import { Children, ReactElement, ReactNode } from 'react';

import { SortDirection } from '@/components';

const getTableCellText = (cell: ReactElement) => {
  const { props } = cell;
  const { children } = props;

  if (!children) {
    return '';
  }

  if (typeof children === 'string') {
    return children;
  }

  const isArrayOfChildren = Array.isArray(children);

  if (isArrayOfChildren) {
    return children
      .map((child: ReactNode) => (typeof child === 'string' ? child : ''))
      .join(' ');
  }

  return '';
};

const parseTableCellValue = (value: string): number | Date | string => {
  const trimmedValue = value.trim();

  const date = Date.parse(trimmedValue);
  const isValidDate = !isNaN(date);

  if (isValidDate) {
    return new Date(date);
  }

  const numeric = trimmedValue.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
  const parsed = parseFloat(numeric);
  const isValidNumber = !isNaN(parsed) && numeric.length > 0;

  if (isValidNumber) {
    return parsed;
  }

  return trimmedValue;
};

interface SortAssistantTableParams {
  bodyRows: ReactElement[];
  sortIndex: number;
  direction: SortDirection;
}

export const sortAssistantTable = ({
  bodyRows,
  sortIndex,
  direction,
}: SortAssistantTableParams) => {
  return [...bodyRows].sort((rowA, rowB) => {
    const { props: propsA } = rowA;
    const { props: propsB } = rowB;

    const { children: childrenA } = propsA;
    const { children: childrenB } = propsB;

    const cellA = Children.toArray(childrenA)[sortIndex] as ReactElement;
    const cellB = Children.toArray(childrenB)[sortIndex] as ReactElement;

    const textA = getTableCellText(cellA);
    const textB = getTableCellText(cellB);
    const valueA = parseTableCellValue(textA);
    const valueB = parseTableCellValue(textB);

    const sortAsc = direction === 'asc';

    if (valueA instanceof Date && valueB instanceof Date) {
      return sortAsc
        ? valueA.getTime() - valueB.getTime()
        : valueB.getTime() - valueA.getTime();
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortAsc ? valueA - valueB : valueB - valueA;
    }

    if (valueA < valueB) {
      return sortAsc ? -1 : 1;
    }

    if (valueA > valueB) {
      return sortAsc ? 1 : -1;
    }

    return 0;
  });
};
