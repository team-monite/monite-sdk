import React from 'react';
import { Layout, Avatar, Menu } from 'antd';
import { MailOutlined } from '@ant-design/icons';

import styles from './styles.module.scss';

const { Sider, Content } = Layout;

type DefaultLayoutProps = {
  children?: React.ReactNode;
};
const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  const items = [
    { label: 'Dashboard', key: 'dashboard', icon: <MailOutlined /> },
    { label: 'Payables', key: 'payables', icon: <MailOutlined /> },
    { label: 'Receivables', key: 'receivables', icon: <MailOutlined /> },
    { label: 'Counterparts', key: 'counterparts', icon: <MailOutlined /> },
  ];

  return (
    <Layout className={styles.layout}>
      <Sider className={styles.sider} width={240}>
        <Avatar size={24}>M</Avatar>
        <Menu items={items} className={styles.menu} />
      </Sider>
      <Layout>
        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
