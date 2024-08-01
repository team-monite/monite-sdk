import * as React from 'react';

import { SvgIconOwnProps } from '@mui/material';

export type MenuItemType = {
  label: string;
  url: string;
  renderIcon: (props?: SvgIconOwnProps) => React.ReactNode;
  children?: Record<string, MenuItemType>;
  onClick?: (e: React.BaseSyntheticEvent) => void;
};
