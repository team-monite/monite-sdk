import React from 'react';

import MenuItem from './MenuItem';
import { ReactComponent as DashboardIcon } from 'assets/icons/grid.svg';
import { ReactComponent as PayablesIcon } from 'assets/icons/dcoin.svg';
import { ReactComponent as ReceivablesIcon } from 'assets/icons/bill.svg';
import { ReactComponent as CounterpartsIcon } from 'assets/icons/bank.svg';
import { ReactComponent as ProductsIcon } from 'assets/icons/cube.svg';
import { ReactComponent as AuditIcon } from 'assets/icons/clipboard.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/setting.svg';
import { ReactComponent as EnvelopeIcon } from 'assets/icons/envelope.svg';
import { MenuItemType } from './types';
import * as Styled from './styles';

const items: MenuItemType[] = [
  {
    label: 'Dashboard',
    url: '/dashboard',
    icon: <DashboardIcon width={20} height={20} />,
  },
  {
    label: 'Payables',
    url: '/payables',
    icon: <PayablesIcon width={20} height={20} />,
  },
  {
    label: 'Receivables',
    url: '/receivables',
    icon: <ReceivablesIcon width={20} height={20} />,
  },
  {
    label: 'Counterparts',
    url: '/counterparts',
    icon: <CounterpartsIcon width={20} height={20} />,
  },
  {
    label: 'Products & Services',
    url: '/products',
    icon: <ProductsIcon width={20} height={20} />,
  },
  {
    label: 'Audit',
    url: '/audit',
    icon: <AuditIcon width={20} height={20} />,
  },
  {
    label: 'Settings',
    url: '/settings',
    icon: <SettingsIcon width={20} height={20} />,
    children: [
      {
        label: 'Approval Policies',
        url: '/settings/approval-policies',
        icon: <EnvelopeIcon width={20} height={20} />,
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
