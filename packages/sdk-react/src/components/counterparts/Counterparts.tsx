import { useCallback, useState } from 'react';

import { CreateCounterpartDialog } from '@/components/counterparts/components';
import { CounterpartDetails } from '@/components/counterparts/CounterpartDetails';
import { CounterpartsTable } from '@/components/counterparts/CounterpartsTable';
import { CustomerTypes } from '@/components/counterparts/types';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { Button } from '@/ui/components/button';
import { Dialog } from '@/ui/Dialog';
import { PageHeader } from '@/ui/PageHeader';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircularProgress } from '@mui/material';

type CounterPartProps = {
  /** @see {@link CustomerTypes} */
  customerTypes?: CustomerTypes;
};

export const Counterparts = (props: CounterPartProps) => (
  <MoniteScopedProviders>
    <CounterpartsBase {...props} />
  </MoniteScopedProviders>
);

const CounterpartsBase = ({ customerTypes }: CounterPartProps) => {
  const { i18n } = useLingui();
  const { componentSettings } = useMoniteContext();

  const [counterpartId, setId] = useState<string | undefined>(undefined);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);

  const handleRowAction = useCallback((id: string) => {
    setOpenDetailsDialog(true);
    setId(id);
  }, []);

  const closeDetailsDialog = useCallback(() => {
    setOpenDetailsDialog(false);
  }, []);

  const handleOnClosedModal = useCallback(() => {
    setId(undefined);
  }, []);

  const { data: user } = useEntityUserByAuthToken();

  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: 'create',
      entityUserId: user?.id,
    });

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: 'read',
      entityUserId: user?.id,
    });

  const { root } = useRootElements();

  const className = 'Monite-Counterparts';

  const counterpartDetails = (() => {
    if (!counterpartId) return null;

    return (
      <Dialog
        alignDialog="right"
        open={openDetailsDialog}
        container={root}
        onClose={closeDetailsDialog}
        onClosed={handleOnClosedModal}
      >
        <CounterpartDetails
          id={counterpartId}
          onDelete={closeDetailsDialog}
          customerTypes={
            customerTypes || componentSettings?.counterparts?.customerTypes
          }
        />
      </Dialog>
    );
  })();

  return (
    <>
      <PageHeader
        className={className + '-Title'}
        title={
          <>
            {t(i18n)`Counterparts`}
            {(isReadAllowedLoading || isCreateAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <div className={className + '-Actions'}>
            <Button
              size="lg"
              onClick={() => setOpenCreateDialog(true)}
              className={className + '-Actions-CreateNew'}
              disabled={!isCreateAllowed}
            >
              {t(i18n)`Create new`}
            </Button>
          </div>
        }
      />

      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && (
        <CounterpartsTable
          onRowClick={handleRowAction}
          openModal={setOpenCreateDialog}
        />
      )}

      {counterpartDetails}

      <CreateCounterpartDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onCreate={(newCounterpartId: string) => {
          setId(newCounterpartId);
          setOpenDetailsDialog(true);
        }}
        customerTypes={
          customerTypes || componentSettings?.counterparts?.customerTypes
        }
      />
    </>
  );
};
