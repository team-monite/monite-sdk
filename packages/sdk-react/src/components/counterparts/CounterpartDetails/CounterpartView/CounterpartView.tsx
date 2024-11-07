import { useCallback, useMemo, useState } from 'react';

import { CounterpartActionsPermissions } from '@/components/counterparts/CounterpartDetails/Counterpart.types';
import { CounterpartVatView } from '@/components/counterparts/CounterpartDetails/CounterpartView/CounterpartVatView';
import { useDialog } from '@/components/Dialog';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { IconWrapper } from '@/ui/iconWrapper';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import {
  Button,
  Typography,
  Divider,
  Grid,
  DialogContent,
  Stack,
  Box,
} from '@mui/material';

import { ConfirmDeleteDialogue } from '../../ConfirmDeleteDialogue';
import { CounterpartDataTestId } from '../../Counterpart.types';
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
  const dialogContext = useDialog();

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
      (isUpdateAllowed || isDeleteAllowed) && (
        <>
          {isUpdateAllowed && (
            <Button
              startIcon={<EditIcon fontSize="small" />}
              variant="text"
              color="primary"
              size="small"
              onClick={onEdit}
            >
              {t(i18n)`Edit`}
            </Button>
          )}

          {isDeleteAllowed && (
            <Button
              startIcon={<DeleteForeverIcon />}
              variant="text"
              color="error"
              size="small"
              onClick={handleOpenDeleteCounterpartDialog}
            >
              {t(i18n)`Delete`}
            </Button>
          )}
        </>
      )
    );
  }, [
    handleOpenDeleteCounterpartDialog,
    i18n,
    isDeleteAllowed,
    isUpdateAllowed,
    onEdit,
  ]);

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
      <Grid container alignItems="center">
        <Grid item xs={11}>
          <Typography variant="h3" sx={{ padding: 3 }}>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={1}>
          {dialogContext?.isDialogContent && (
            <IconWrapper
              aria-label={t(i18n)`Counterpart Close`}
              onClick={dialogContext.onClose}
              color="default"
              showCloseIcon
            />
          )}
        </Grid>
      </Grid>
      <Divider />
      <DialogContent>
        <Stack direction="column" spacing={4}>
          <ConfirmDeleteDialogue
            open={showDeleteCounterpart}
            type={t(i18n)`Counterpart`}
            name={getCounterpartName(counterpart)}
            isLoading={isLoading}
            onClose={handleCloseDeleteCounterpartDialog}
            onDelete={handleDeleteCounterpart}
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
            <Typography variant="subtitle2">{t(i18n)`Vat IDs`}</Typography>

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
    </>
  );
};
