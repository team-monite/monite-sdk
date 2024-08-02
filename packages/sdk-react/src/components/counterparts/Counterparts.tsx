import { useCallback, useEffect, useState } from 'react';

import { components } from '@/api';
import { CounterpartDetails } from '@/components/counterparts/CounterpartDetails';
import { CounterpartsTable } from '@/components/counterparts/CounterpartsTable';
import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMenuButton } from '@/core/hooks';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Button, CircularProgress, Menu, MenuItem } from '@mui/material';

export const Counterparts = () => (
  <MoniteScopedProviders>
    <CounterpartsBase />
  </MoniteScopedProviders>
);

const CounterpartsBase = () => {
  const { i18n } = useLingui();

  const { open, menuProps, buttonProps } = useMenuButton();

  const [counterpartId, setId] = useState<string | undefined>(undefined);
  const [counterpartType, setType] = useState<
    components['schemas']['CounterpartType'] | undefined
  >(undefined);
  const [openDetails, setOpenDetails] = useState<boolean>(false);

  useEffect(() => {
    if (!counterpartId && !counterpartType) {
      setOpenDetails(false);

      return;
    }

    if (counterpartId || counterpartType) {
      setOpenDetails(true);
    }
  }, [counterpartId, counterpartType]);

  const closeModal = useCallback(() => {
    setOpenDetails(false);
  }, []);

  const closedModal = useCallback(() => {
    setId(undefined);
    setType(undefined);
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
    if (counterpartId) {
      return (
        <Dialog
          alignDialog="right"
          open={openDetails}
          container={root}
          onClose={closeModal}
          onClosed={closedModal}
        >
          <CounterpartDetails id={counterpartId} onDelete={closeModal} />
        </Dialog>
      );
    } else if (counterpartType) {
      return (
        <Dialog
          alignDialog="right"
          open={openDetails}
          container={root}
          onClose={closeModal}
          onClosed={closedModal}
        >
          <CounterpartDetails type={counterpartType} onDelete={closeModal} />
        </Dialog>
      );
    } else {
      return null;
    }
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
              className={className + '-Actions-CreateNew'}
              variant="contained"
              disabled={!isCreateAllowed}
              endIcon={
                open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
              }
            >
              {t(i18n)`Create New`}
            </Button>
            <Menu
              {...menuProps}
              className={className + '-Actions-Menu'}
              container={root}
              MenuListProps={{
                'aria-labelledby': 'actions',
              }}
            >
              <MenuItem
                className={className + '-Actions-CreateNew-Organization'}
                onClick={() => {
                  setType('organization');
                }}
              >
                {t(i18n)`Organization`}
              </MenuItem>
              <MenuItem
                className={className + '-Actions-CreateNew-Individual'}
                onClick={() => {
                  setType('individual');
                }}
              >
                {t(i18n)`Individual`}
              </MenuItem>
            </Menu>
          </Box>
        }
      />
      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && <CounterpartsTable onRowClick={setId} onEdit={setId} />}
      {counterpartDetails}
    </>
  );
};
