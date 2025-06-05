import { Children, ReactElement, ReactNode } from 'react';

import { SortDirection } from '@/components';
import { DATE_FORMATS, TIME_FORMATS } from '@/components/aiAssistant/consts';

import { isValid, parse } from 'date-fns';

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

export const getParsedDate = (value: string) => {
  const timeFormats = value.includes(':') ? TIME_FORMATS : [''];
  const formats = DATE_FORMATS.flatMap((dateFormat) =>
    timeFormats.map((timeFormat) => `${dateFormat}${timeFormat}`)
  );

  let date;

  for (let i = 0; i < formats.length; i++) {
    date = parse(value, formats[i], new Date());

    if (isValid(date)) {
      break;
    }
  }

  return date;
};

const parseTableCellValue = (value: string): number | Date | string => {
  const trimmedValue = value.trim();

  const parsedDate = getParsedDate(trimmedValue);
  const isValidDate = parsedDate && isValid(parsedDate);

  if (isValidDate) {
    return parsedDate;
  }

  const numeric = trimmedValue.replace(/[^\d.-]/g, '').replace(/,/g, '');
  const parsed = parseFloat(numeric);
  const isValidNumber =
    !isNaN(parsed) && Number.isFinite(parsed) && numeric.length > 0;
  const decimalCount = (numeric.match(/\./g) || []).length;

  if (decimalCount > 1) {
    return trimmedValue;
  }

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

    const maxCellIndex =
      Math.min(
        Children.toArray(childrenA).length,
        Children.toArray(childrenB).length
      ) - 1;

    if (sortIndex > maxCellIndex || sortIndex < 0) {
      return 0;
    }

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
