import { useCallback, useState } from 'react';

import { TagFormModal } from '@/components/tags/TagFormModal';
import { TagsTable } from '@/components/tags/TagsTable';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { Button } from '@/ui/components/button';
import { PageHeader } from '@/ui/PageHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircularProgress } from '@mui/material';

export const Tags = () => (
  <MoniteScopedProviders>
    <TagsBase />
  </MoniteScopedProviders>
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
      action: 'create',
      entityUserId: user?.id,
    });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'tag',
      action: 'read',
      entityUserId: user?.id,
    });

  const { data: isDeleteAllowed } = useIsActionAllowed({
    method: 'tag',
    action: 'delete',
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
            size="lg"
            disabled={!isCreateAllowed}
            onClick={showCreationModal}
          >
            {t(i18n)`Create new`}
          </Button>
        }
      />
      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && <TagsTable showCreationModal={showCreationModal} />}
      <TagFormModal
        open={creationModalOpened}
        onClose={hideCreationModal}
        isDeleteAllowed={isDeleteAllowed ?? false}
      />
    </>
  );
};
