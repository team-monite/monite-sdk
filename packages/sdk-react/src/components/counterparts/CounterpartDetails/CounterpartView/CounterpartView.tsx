import { useCallback, useMemo, useState } from 'react';

import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { CounterpartVatView } from '@/components/counterparts/CounterpartDetails/CounterpartView/CounterpartVatView';
import { CounterpartDataTestId } from '@/components/counterparts/types';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Typography, DialogContent, Stack, Box } from '@mui/material';

import { ConfirmDeleteDialog } from '../../components/ConfirmDeleteDialog';
import {
  getCounterpartName,
  isIndividualCounterpart,
  isOrganizationCounterpart,
} from '../../helpers';
import {
  prepareCounterpartIndividual,
  prepareCounterpartOrganization,
} from '../CounterpartForm';
import { CounterpartAddressView } from './CounterpartAddressView';
import { CounterpartBankView } from './CounterpartBankView';
import { CounterpartContactView } from './CounterpartContactView';
import { CounterpartIndividualView } from './CounterpartIndividualView';
import { CounterpartOrganizationView } from './CounterpartOrganizationView';
import { CounterpartViewProps, useCounterpartView } from './useCounterpartView';

export const CounterpartView = (props: CounterpartViewProps) => {
  const { i18n } = useLingui();
  const {
    counterpart,
    addresses,
    banks,
    vats,
    contacts,
    deleteCounterpart,
    isLoading,
    onEdit,
    title,
  } = useCounterpartView(props);

  const isEmailDefault =
    counterpart && contacts && isOrganizationCounterpart(counterpart)
      ? contacts.some(
          (contact) =>
            contact.is_default &&
            contact.email === counterpart.organization?.email
        )
      : false;

  const { data: isReadAvailable, isLoading: isReadAvailableLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: 'read',
      entityUserId: counterpart?.created_by_entity_user_id,
    });

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'counterpart',
    action: 'update',
    entityUserId: counterpart?.created_by_entity_user_id,
  });

  const { data: isCreateAllowed, isLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: 'create',
      entityUserId: counterpart?.created_by_entity_user_id,
    });

  const { data: isDeleteAllowed, isLoading: isDeleteAllowedLoading } =
    useIsActionAllowed({
      method: 'counterpart',
      action: 'delete',
      entityUserId: counterpart?.created_by_entity_user_id,
    });

  const counterpartPermissions: CounterpartActionsPermissions = {
    isUpdateAllowed,
    isDeleteAllowed,
  };

  const [showDeleteCounterpart, setShowDeleteCounterpart] =
    useState<boolean>(false);

  const handleOpenDeleteCounterpartDialog = useCallback(() => {
    setShowDeleteCounterpart(true);
  }, []);

  const handleCloseDeleteCounterpartDialog = useCallback(() => {
    setShowDeleteCounterpart(false);
  }, []);

  const handleDeleteCounterpart = useCallback(() => {
    deleteCounterpart(handleCloseDeleteCounterpartDialog);
  }, [deleteCounterpart, handleCloseDeleteCounterpartDialog]);

  const actions = useMemo(() => {
    return (
      isUpdateAllowed && (
        <Button
          startIcon={<EditIcon fontSize="small" />}
          variant="text"
          color="primary"
          size="small"
          onClick={onEdit}
        >
          {t(i18n)`Edit`}
        </Button>
      )
    );
  }, [i18n, isUpdateAllowed, onEdit]);

  if (
    isLoading ||
    isCreateAllowedLoading ||
    isDeleteAllowedLoading ||
    isReadAvailableLoading
  ) {
    return <LoadingPage />;
  }

  if (!isReadAvailable) {
    return <AccessRestriction />;
  }

  if (!counterpart) {
    return (
      <NotFound
        title={t(i18n)`Counterpart not found`}
        description={t(
          i18n
        )`There is no counterpart by provided id: ${props.id}`}
      />
    );
  }
  return (
    <>
      <DialogHeader
        title={title}
        closeButtonTooltip={t(i18n)`Close counterpart`}
      />
      <DialogContent>
        <Stack direction="column" spacing={4}>
          <ConfirmationModal
            open={showDeleteCounterpart}
            title={t(i18n)`Delete Counterpart “${getCounterpartName(
              counterpart
            )}“?`}
            message={t(i18n)`You can’t undo this action.`}
            confirmLabel={t(i18n)`Delete`}
            cancelLabel={t(i18n)`Cancel`}
            onClose={handleCloseDeleteCounterpartDialog}
            onConfirm={handleDeleteCounterpart}
            isLoading={isLoading}
          />

          {counterpart && isOrganizationCounterpart(counterpart) && (
            <CounterpartOrganizationView
              actions={actions}
              showCategories={props.showCategories ?? true}
              counterpart={{
                taxId: counterpart.tax_id,
                ...prepareCounterpartOrganization(
                  counterpart.organization,
                  undefined
                ),
              }}
              isEmailDefault={isEmailDefault}
            />
          )}

          {counterpart && isIndividualCounterpart(counterpart) && (
            <CounterpartIndividualView
              actions={actions}
              showCategories={props.showCategories ?? true}
              counterpart={{
                taxId: counterpart.tax_id,
                ...prepareCounterpartIndividual(counterpart.individual),
              }}
            />
          )}

          {counterpart && addresses[0] && (
            <Stack
              direction="column"
              spacing={2}
              data-testid={CounterpartDataTestId.Address}
            >
              <Typography variant="subtitle2">{t(i18n)`Address`}</Typography>
              <CounterpartAddressView
                address={addresses[0]}
                onEdit={props.onAddressEdit}
                permissions={counterpartPermissions}
              />
            </Stack>
          )}

          <Stack
            direction="column"
            spacing={2}
            data-testid={CounterpartDataTestId.Vat}
          >
            <Typography variant="subtitle2">{t(i18n)`VAT IDs`}</Typography>

            {vats?.map((vat) => (
              <CounterpartVatView
                key={vat.id}
                permissions={counterpartPermissions}
                vat={vat}
                onEdit={props.onVatEdit}
                onDelete={props.onVatDelete}
              />
            ))}

            {isCreateAllowed && (
              <Box>
                <Button
                  color="primary"
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={props.onVatCreate}
                >
                  {t(i18n)`Add VAT ID`}
                </Button>
              </Box>
            )}
          </Stack>

          {counterpart && isOrganizationCounterpart(counterpart) && (
            <Stack
              direction="column"
              spacing={2}
              data-testid={CounterpartDataTestId.ContactPerson}
            >
              <Typography variant="subtitle2">
                {t(i18n)`Contact persons`}
              </Typography>

              {contacts?.map((contact) => (
                <CounterpartContactView
                  key={contact.id}
                  contact={contact}
                  onEdit={props.onContactEdit}
                  onDelete={props.onContactDelete}
                  permissions={counterpartPermissions}
                />
              ))}

              {isCreateAllowed && (
                <Box>
                  <Button
                    color="primary"
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={props.onContactCreate}
                  >
                    {t(i18n)`Add contact person`}
                  </Button>
                </Box>
              )}
            </Stack>
          )}

          {counterpart && props.showBankAccounts && (
            <Stack
              direction="column"
              spacing={2}
              data-testid={CounterpartDataTestId.BankAccount}
            >
              <Typography variant="subtitle2">
                {t(i18n)`Bank accounts`}
              </Typography>

              {banks?.map((bank) => (
                <CounterpartBankView
                  key={bank.id}
                  bank={bank}
                  onEdit={props.onBankEdit}
                  onDelete={props.onBankDelete}
                  permissions={counterpartPermissions}
                />
              ))}

              {isCreateAllowed && (
                <Box>
                  <Button
                    color="primary"
                    variant="outlined"
                    startIcon={<AddCircleOutlineIcon />}
                    onClick={props.onBankCreate}
                  >
                    {t(i18n)`Add bank account`}
                  </Button>
                </Box>
              )}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogFooter
        deleteButton={{
          label: t(i18n)`Delete`,
          onClick: handleOpenDeleteCounterpartDialog,
          isDisabled: !isDeleteAllowed,
        }}
      />
    </>
  );
};
