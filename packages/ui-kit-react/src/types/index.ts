import React from 'react';
import { Theme } from 'consts';

export interface ThemeProps {
  theme: Theme;
}

export type ThemedStyledProps<P> = P & ThemeProps;

export enum SortOrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export type TooltipProps = {
  tip?: string | React.ReactNode;
  effect?: 'float' | 'solid';
  [key: string]: any;
};
