import { type ReactNode, useState } from 'react';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemText,
  type IconButtonProps,
  type MenuProps,
} from '@mui/material';

export interface DropdownMenuItem {
  key: string;
  label: ReactNode;
  sx?: object;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface DropdownMenuProps {
  id?: string;
  items: DropdownMenuItem[];
  iconButtonProps?: IconButtonProps;
  menuProps?: Partial<MenuProps>;
}

export const DropdownMenu = ({
  id = 'dropdown-menu-button',
  items,
  iconButtonProps,
  menuProps,
}: DropdownMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        id={id}
        onClick={handleMenuClick}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          width: 40,
          height: 40,
        }}
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
        {...iconButtonProps}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        container={() => document.body}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{
          'aria-labelledby': id,
          role: 'menu',
        }}
        {...menuProps}
      >
        {items.map(({ key, label, onClick, sx }) => (
          <MenuItem
            id={key}
            key={key}
            onClick={(e) => {
              handleMenuClose();
              onClick?.(e);
            }}
            sx={sx}
          >
            <ListItemText primary={label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
