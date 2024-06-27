import React, { ReactNode } from 'react';

import { ListItemText, MenuItem, MenuItemProps } from '@mui/material';

import { IconCheck } from '@/icons';

type ThemeSelectMenuItemProps = {
  accessory?: ReactNode;
  checked?: boolean;
  children?: ReactNode;
  onClick?: MenuItemProps['onClick'];
};

export const ThemeSelectMenuItem = (props: ThemeSelectMenuItemProps) => {
  const { accessory, checked, children, onClick } = props;

  return (
    <MenuItem className="theme-selection-menu-item" onClick={onClick}>
      <ListItemText className="theme-selection-menu-item__label">
        {children}
      </ListItemText>
      {checked ? (
        <span className="theme-selection-menu-item__check">
          <IconCheck />
        </span>
      ) : null}
      {accessory}
    </MenuItem>
  );
};
