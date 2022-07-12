import React from 'react';

export type MenuItemType = {
  label: string;
  url: string;
  icon: React.ReactNode;
  children?: MenuItemType[];
};
