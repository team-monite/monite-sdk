import React from 'react';

export type MenuItemType = {
  label: string;
  url: string;
  renderIcon: (props: any) => React.ReactNode;
  apiLink?: string;
  children?: Record<string, MenuItemType>;
  onClick?: (e: React.BaseSyntheticEvent) => void;
};
