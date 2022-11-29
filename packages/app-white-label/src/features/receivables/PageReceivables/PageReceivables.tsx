import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  Dropdown,
  DropdownMenuItem,
  UAngleDown,
} from '@team-monite/ui-kit-react';
import {
  ReceivablesTable,
  ReceivableDetails,
  CreateInvoice,
  RECEIVABLE_TYPES,
} from '@team-monite/ui-widgets-react';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';

import { CREATE_BY_TYPE } from './consts';

const RECEIVABLE_ID = 'id';

const PageReceivables = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const creationType = searchParams.get(CREATE_BY_TYPE);

  const openCreateNew = (type: RECEIVABLE_TYPES) => {
    searchParams.set(CREATE_BY_TYPE, type);
    setSearchParams(searchParams);
  };

  const closeCreateNew = () => {
    searchParams.delete(CREATE_BY_TYPE);
    setSearchParams(searchParams);
  };

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
      <PageHeader
        title={t('receivables:sales')}
        extra={
          <Dropdown
            button={
              <Button rightIcon={<UAngleDown />}>
                {t('common:createNew')}
              </Button>
            }
          >
            <DropdownMenuItem
              onClick={() => openCreateNew(RECEIVABLE_TYPES.INVOICE)}
            >
              {t('receivables:invoice')}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              {t('receivables:quote')}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              {t('receivables:creditNote')}
            </DropdownMenuItem>
          </Dropdown>
        }
      />
      <ReceivablesTable onRowClick={onRowClick} />
      {id && <ReceivableDetails id={id} onClose={closeModal} />}
      {creationType &&
        Object.values(RECEIVABLE_TYPES).some(
          (type) => type === creationType
        ) && (
          <CreateInvoice
            type={creationType as RECEIVABLE_TYPES}
            onClose={closeCreateNew}
          />
        )}
    </Layout>
  );
};

export default PageReceivables;
