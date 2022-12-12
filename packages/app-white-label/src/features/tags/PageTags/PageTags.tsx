import React from 'react';
import { useTranslation } from 'react-i18next';
import { TagsTable, CreateTagModal } from '@team-monite/ui-widgets-react';
import { Button, useModal } from '@team-monite/ui-kit-react';

import Layout from 'features/app/Layout';
import PageHeader from 'features/app/Layout/PageHeader';

const PageTags = () => {
  const { t } = useTranslation();
  const { show, hide, isOpen } = useModal();

  return (
    <Layout>
      <PageHeader
        title={t('tags:tags')}
        extra={<Button onClick={show}>{t('tags:createNewTag')}</Button>}
      />
      <TagsTable />
      {isOpen && <CreateTagModal onClose={hide} />}
    </Layout>
  );
};

export default PageTags;
