'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
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
      ? { component: 'button', onClick }
      : { component: Link, href };

  return (
    <ListItem className="navigation-list-item">
      <ListItemButton
        className="navigation-list-item__button"
        selected={selected}
        {...buttonProps}
      >
        <ListItemIcon className="navigation-list-item__icon">
          {icon}
        </ListItemIcon>
        <ListItemText className="navigation-list-item__text">
          <Typography component="span" variant="label2">
            {children}
          </Typography>
        </ListItemText>
        {endIcon}
      </ListItemButton>
    </ListItem>
  );
};
