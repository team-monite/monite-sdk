import { BaseSyntheticEvent, ReactNode } from 'react';

import { SvgIconOwnProps } from '@mui/material';

export type MenuItemType = {
  label: string;
  url: string;
  renderIcon: (props?: SvgIconOwnProps) => ReactNode;
  children?: Record<string, MenuItemType>;
  onClick?: (e: BaseSyntheticEvent) => void;
};
