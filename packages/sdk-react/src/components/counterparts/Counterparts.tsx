import { useCallback, useState } from 'react';

import { CreateCounterpartModal } from '@/components/counterparts/components';
import { CounterpartDetails } from '@/components/counterparts/CounterpartDetails';
import { CounterpartsTable } from '@/components/counterparts/CounterpartsTable';
import { CustomerTypes } from '@/components/counterparts/types';
import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMenuButton } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Button, CircularProgress } from '@mui/material';

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

  const { buttonProps } = useMenuButton();

  const [counterpartId, setId] = useState<string | undefined>(undefined);
  const [openDetails, setOpenDetails] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleRowAction = useCallback((id: string) => {
    setOpenDetails(true);
    setId(id);
  }, []);

  const closeModal = useCallback(() => {
    setOpenDetails(false);
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
        open={openDetails}
        container={root}
        onClose={closeModal}
        onClosed={handleOnClosedModal}
      >
        <CounterpartDetails
          id={counterpartId}
          onDelete={closeModal}
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
          <Box className={className + '-Actions'}>
            <Button
              {...buttonProps}
              onClick={() => setOpenModal(true)}
              className={className + '-Actions-CreateNew'}
              variant="contained"
              disabled={!isCreateAllowed}
            >
              {t(i18n)`Create New`}
            </Button>
          </Box>
        }
      />

      {openModal && (
        <CreateCounterpartModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          onCreate={(newCounterpartId: string) => {
            setId(newCounterpartId);
            setOpenModal(false);
            setOpenDetails(true);
          }}
          customerTypes={
            customerTypes || componentSettings?.counterparts?.customerTypes
          }
        />
      )}

      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && (
        <CounterpartsTable
          onRowClick={handleRowAction}
          onEdit={handleRowAction}
          openModal={setOpenModal}
        />
      )}
      {counterpartDetails}
    </>
  );
};
