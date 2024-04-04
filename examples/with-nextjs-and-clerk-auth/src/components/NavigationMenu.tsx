'use client';

import React, {
  BaseSyntheticEvent,
  Fragment,
  ReactElement,
  useState,
} from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  AccountBalance,
  ExpandLess,
  ExpandMore,
  Label,
  MonetizationOn,
  Receipt,
  Settings,
  Tab,
} from '@mui/icons-material';
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIconOwnProps,
} from '@mui/material';

export const NavigationMenu = () => {
  const [activeMenuItemKey, setActiveMenuItemKey] = useState<
    keyof typeof navigationMenuItems | null
  >(null);

  const handleCollapse = (key: keyof typeof navigationMenuItems) => {
    setActiveMenuItemKey(key === activeMenuItemKey ? null : key);
  };

  const pathname = usePathname();

  return (
    <List>
      {Object.entries(navigationMenuItems).map(([menuItemKey, menuItem]) => {
        const selected =
          'url' in menuItem &&
          (menuItem.url === '/'
            ? pathname === menuItem.url
            : pathname.startsWith(menuItem.url));

        const listItemChildren = (
          <>
            <ListItemIcon>
              <menuItem.Icon color="primary" />
            </ListItemIcon>
            <ListItemText primary={menuItem.label} />
          </>
        );

        return !('subItems' in menuItem) ? (
          <ListItemButton
            key={menuItemKey}
            component={Link}
            selected={selected}
            href={menuItem.url}
          >
            {listItemChildren}
          </ListItemButton>
        ) : (
          <Fragment key={menuItemKey}>
            <ListItemButton
              selected={selected}
              onClick={(event) => {
                handleCollapse(menuItemKey);
              }}
            >
              {listItemChildren}
              {menuItem.subItems && activeMenuItemKey === menuItemKey ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>

            <Collapse
              in={activeMenuItemKey === menuItemKey}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {menuItem.subItems.map((menuSubItem, index) => (
                  <ListItemButton
                    key={index}
                    component={Link}
                    selected={selected}
                    href={menuSubItem.url}
                    sx={{ pl: 4 }}
                  >
                    <ListItemIcon>
                      {menuSubItem.Icon({ color: 'primary' })}
                    </ListItemIcon>
                    <ListItemText primary={menuSubItem.label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Fragment>
        );
      })}
    </List>
  );
};

export const navigationMenuItems: Record<string, MenuItemType> = {
  payables: {
    label: 'Payables',
    url: '/',
    Icon: (props) => <MonetizationOn {...props} />,
  },
  receivables: {
    label: 'Sales',
    url: '/receivables',
    Icon: (props) => <Receipt {...props} />,
  },
  counterparts: {
    label: 'Counterparts',
    url: '/counterparts',
    Icon: (props) => <AccountBalance {...props} />,
  },
  products: {
    label: 'Products',
    url: '/products',
    Icon: (props) => <Tab {...props} />,
  },
  settings: {
    label: 'Settings',
    Icon: (props) => <Settings {...props} />,
    subItems: [
      {
        label: 'Approval Policies',
        url: '/approval-policies',
        Icon: (props) => <Tab {...props} />,
      },
      {
        label: 'User Roles',
        url: '/user-roles',
        Icon: (props) => <Tab {...props} />,
      },
      {
        label: 'Tags',
        url: '/tags',
        Icon: (props) => <Label {...props} />,
      },
    ],
  },
};

export type MenuItemType = {
  label: string;
  Icon: (props?: SvgIconOwnProps) => ReactElement;
  onClick?: (e: BaseSyntheticEvent) => void;
} & (
  | { url: string }
  | {
      subItems: {
        label: string;
        Icon: (props?: SvgIconOwnProps) => ReactElement;
        url: string;
      }[];
    }
);
