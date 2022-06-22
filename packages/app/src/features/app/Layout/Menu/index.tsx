import React from 'react';

import { ReactComponent as DashboardIcon } from 'assets/icons/grid.svg';
import { ReactComponent as PayablesIcon } from 'assets/icons/dcoin.svg';
import { ReactComponent as ReceivablesIcon } from 'assets/icons/bill.svg';
import { ReactComponent as CounterpartsIcon } from 'assets/icons/bank.svg';
import { ReactComponent as ProductsIcon } from 'assets/icons/cube.svg';
import { ReactComponent as AuditIcon } from 'assets/icons/clipboard.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/setting.svg';

import * as Styled from './styles';

type MenuItem = {
  label: string;
  url: string;
  icon: React.ReactNode;
  children?: MenuItem[];
};

const items: MenuItem[] = [
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
        label: 'SubMenu1',
        url: '/sub1',
        icon: <AuditIcon width={20} height={20} />,
      },
    ],
  },
];

const MenuLink = ({ link }: any) => {
  return (
    <Styled.MenuLink to={link.url}>
      <Styled.LinkIcon>{link.icon}</Styled.LinkIcon>
      <Styled.LinkText textSize="smallBold" ml="8px">
        {link.label}
      </Styled.LinkText>
    </Styled.MenuLink>
  );
};

const Menu = () => {
  return (
    <Styled.Menu>
      {items.map((link) => (
        <MenuLink key={link.url} link={link} />
      ))}
    </Styled.Menu>
  );
};

export default Menu;
