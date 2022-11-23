import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import {
  ReceivablesTable,
  ReceivableDetails,
} from '@team-monite/ui-widgets-react';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';

const RECEIVABLE_ID = 'id';

const PageReceivables = () => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get(RECEIVABLE_ID);

  const onRowClick = (id: string) => {
    searchParams.set(RECEIVABLE_ID, id);
    setSearchParams(searchParams);
  };

  const closeModal = () => {
    searchParams.delete(RECEIVABLE_ID);
    setSearchParams(searchParams);
  };
  return (
    <Layout>
      <PageHeader title={t('receivables:sales')} />
      <ReceivablesTable onRowClick={onRowClick} />
      {id && <ReceivableDetails id={id} onClose={closeModal} />}
    </Layout>
  );
};

export default PageReceivables;
