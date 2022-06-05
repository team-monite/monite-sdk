import React from 'react';
import { Layout, Menu, MenuProps } from 'antd';

import { ReactComponent as DashboardIcon } from 'assets/icons/grid.svg';
import { ReactComponent as PayablesIcon } from 'assets/icons/dcoin.svg';
import { ReactComponent as ReceivablesIcon } from 'assets/icons/bill.svg';
import { ReactComponent as CounterpartsIcon } from 'assets/icons/bank.svg';
import { ReactComponent as ProductsIcon } from 'assets/icons/cube.svg';
import { ReactComponent as AuditIcon } from 'assets/icons/clipboard.svg';
import { ReactComponent as SettingsIcon } from 'assets/icons/setting.svg';

import Avatar from 'features/ui/Avatar';

import styles from './styles.module.scss';

const { Sider, Content } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

type DefaultLayoutProps = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const items: MenuItem[] = [
    {
      label: 'Dashboard',
      key: 'dashboard',
      icon: <DashboardIcon width={20} height={20} />,
    },
    {
      label: 'Payables',
      key: 'payables',
      icon: <PayablesIcon width={20} height={20} />,
    },
    {
      label: 'Receivables',
      key: 'receivables',
      icon: <ReceivablesIcon width={20} height={20} />,
    },
    {
      label: 'Counterparts',
      key: 'counterparts',
      icon: <CounterpartsIcon width={20} height={20} />,
    },
    {
      label: 'Products & Services',
      key: 'products',
      icon: <ProductsIcon width={20} height={20} />,
    },
    {
      label: 'Audit',
      key: 'audit',
      icon: <AuditIcon width={20} height={20} />,
    },
    {
      label: 'Settings',
      key: 'settings',
      icon: <SettingsIcon width={20} height={20} />,
      children: [
        {
          label: 'SubMenu1',
          key: 'sub1',
          icon: <AuditIcon width={20} height={20} />,
        },
      ],
    },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider} width={240}>
        <div className={styles.company}>
          <Avatar size={44}>M</Avatar>
          <Menu
            selectable={false}
            inlineIndent={12}
            mode="inline"
            className={styles.companyMenu}
            items={[
              {
                label: 'Silver Wind LLC',
                key: 'Silver Wind LLC',
              },
            ]}
          />
        </div>
        <Menu
          selectable={false}
          mode="inline"
          items={items}
          className={styles.menu}
        />
      </Sider>
      <Layout>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
