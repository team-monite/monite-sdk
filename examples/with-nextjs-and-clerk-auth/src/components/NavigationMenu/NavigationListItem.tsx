'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Box,
  ListItem,
  ListItemButton,
  ListItemButtonProps,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

type NavigationLinkProps = {
  children?: ReactNode;
  endIcon?: ReactNode;
  href?: string;
  icon: ReactNode;
  onClick?: ListItemButtonProps['onClick'];
};

export const NavigationListItem = ({
  endIcon,
  children,
  href,
  icon,
  onClick,
}: NavigationLinkProps) => {
  const pathname = usePathname();
  const selected = pathname === href;

  const buttonProps =
    href === undefined
      ? { component: 'span', onClick }
      : { component: Link, href };

  return (
    <ListItem sx={{ padding: 0 }}>
      <ListItemButton selected={selected} {...buttonProps}>
        <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon>
        <ListItemText>
          <Typography
            component="span"
            variant="label2"
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
