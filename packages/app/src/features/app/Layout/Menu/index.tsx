import React from 'react';

import MenuItem from './MenuItem';
import {
  THEMES,
  UApps,
  UUsdCircle,
  UInvoice,
  UUniversity,
  UBox,
  USetting,
  UClipboardNotes,
  UPostcard,
} from '@monite/ui';

import { MenuItemType } from './types';
import * as Styled from './styles';

const iconColor = THEMES.default.colors.primary;

const items: MenuItemType[] = [
  {
    label: 'Dashboard',
    url: '/dashboard',
    icon: <UApps width={20} color={iconColor} />,
  },
  {
    label: 'Payables',
    url: '/payables',
    icon: <UUsdCircle width={20} color={iconColor} />,
  },
  {
    label: 'Receivables',
    url: '/receivables',
    icon: <UInvoice width={20} color={iconColor} />,
  },
  {
    label: 'Counterparts',
    url: '/counterparts',
    icon: <UUniversity width={20} color={iconColor} />,
  },
  {
    label: 'Products & Services',
    url: '/products',
    icon: <UBox width={20} color={iconColor} />,
  },
  {
    label: 'Audit',
    url: '/audit',
    icon: <UClipboardNotes width={20} color={iconColor} />,
  },
  {
    label: 'Settings',
    url: '/settings',
    icon: <USetting width={20} color={iconColor} />,
    children: [
      {
        label: 'Approval Policies',
        url: '/settings/approval-policies',
        icon: <UPostcard width={20} color={iconColor} />,
      },
    ],
  },
];

const Menu = () => {
  return (
    <Styled.Menu>
      {items.map((item) => (
        <MenuItem key={item.url} item={item} />
      ))}
    </Styled.Menu>
  );
};

export default Menu;
