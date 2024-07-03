import React, { ReactNode } from 'react';

import { Box, ListItemText, MenuItem, MenuItemProps } from '@mui/material';

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
    <MenuItem onClick={onClick}>
      <ListItemText>{children}</ListItemText>
      {checked ? <IconCheck sx={{ color: 'primary.main' }} /> : null}
      {accessory}
    </MenuItem>
  );
};
