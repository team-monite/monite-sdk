import React from 'react';
import { CounterpartsFormCreate, Button } from '@monite/react-kit';
import { useNavigate } from 'react-router-dom';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';
import { ROUTES } from 'features/app/App';

import styles from './styles.module.scss';

const PageCounterpartsCreate = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <PageHeader
        title="Create Counterpart"
        extra={[
          <Button
            key="1"
            onClick={() => navigate(ROUTES.counterparts)}
            text="Back"
          />,
        ]}
      />
      <div className={styles.wrapper}>
        <CounterpartsFormCreate />
      </div>
    </Layout>
  );
};

export default PageCounterpartsCreate;
