import { useCallback, useState } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { TagFormModal } from '@/components/tags/TagFormModal';
import { TagsTable } from '@/components/tags/TagsTable';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Button } from '@mui/material';

export const Tags = () => {
  const { i18n } = useLingui();
  const [creationModalOpened, setCreationModalOpened] =
    useState<boolean>(false);
  const showCreationModal = useCallback(() => {
    setCreationModalOpened(true);
  }, []);
  const hideCreationModal = useCallback(() => {
    setCreationModalOpened(false);
  }, []);

  return (
    <MoniteStyleProvider>
      <PageHeader
        title={t(i18n)`Tags`}
        extra={
          <Button variant="contained" onClick={showCreationModal}>
            {t(i18n)`Create new tag`}
          </Button>
        }
      />
      <TagsTable />
      <TagFormModal open={creationModalOpened} onClose={hideCreationModal} />
    </MoniteStyleProvider>
  );
};
