import React, { useCallback, useState } from 'react';

import { PageHeader } from '@/components/PageHeader';
import { TagFormModal } from '@/components/tags/TagFormModal';
import { TagsTable } from '@/components/tags/TagsTable';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ActionEnum } from '@monite/sdk-api';
import { Button, CircularProgress } from '@mui/material';

export const Tags = () => (
  <MoniteStyleProvider>
    <TagsBase />
  </MoniteStyleProvider>
);

const TagsBase = () => {
  const { i18n } = useLingui();
  const [creationModalOpened, setCreationModalOpened] =
    useState<boolean>(false);
  const showCreationModal = useCallback(() => {
    setCreationModalOpened(true);
  }, []);
  const hideCreationModal = useCallback(() => {
    setCreationModalOpened(false);
  }, []);

  const { data: user } = useEntityUserByAuthToken();

  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'tag',
      action: ActionEnum.CREATE,
      entityUserId: user?.id,
    });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'tag',
      action: ActionEnum.READ,
      entityUserId: user?.id,
    });

  return (
    <>
      <PageHeader
        title={
          <>
            {t(i18n)`Tags`}
            {(isReadAllowedLoading || isCreateAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <Button
            variant="contained"
            disabled={!isCreateAllowed}
            onClick={showCreationModal}
          >
            {t(i18n)`Create new tag`}
          </Button>
        }
      />
      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && <TagsTable />}

      <TagFormModal open={creationModalOpened} onClose={hideCreationModal} />
    </>
  );
};
