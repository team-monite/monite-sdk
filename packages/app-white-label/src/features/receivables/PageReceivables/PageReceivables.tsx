import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReceivablesTable } from '@team-monite/ui-widgets-react';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';

const PageReceivables = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <PageHeader title={t('receivables:sales')} />
      <ReceivablesTable />
    </Layout>
  );
};

export default PageReceivables;
