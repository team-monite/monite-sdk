'use client';

import {
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

type NavigationLinkProps = {
  children?: ReactNode;
  endIcon?: ReactNode;
  href?: string;
  target?: string;
  icon: ReactNode;
  onClick?: ListItemButtonProps['onClick'];
};

export const NavigationListItem = ({
  endIcon,
  children,
  href,
  target,
  icon,
  onClick,
}: NavigationLinkProps) => {
  const pathname = usePathname();
  const selected = pathname === href;

  const buttonProps =
    href !== undefined ? { component: Link, href, target } : {};

  return (
    <ListItem sx={{ padding: 0 }}>
      <ListItemButton {...buttonProps} onClick={onClick} selected={selected}>
        <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
        <ListItemText>
          <Typography
            component="span"
            color={selected ? 'primary.main' : undefined}
          >
            {children}
          </Typography>
        </ListItemText>
        {endIcon}
      </ListItemButton>
    </ListItem>
  );
};
