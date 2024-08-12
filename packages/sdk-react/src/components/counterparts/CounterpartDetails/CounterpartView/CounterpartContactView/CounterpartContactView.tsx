import { type MouseEvent, useCallback, useState } from 'react';

import { DefaultEmail } from '@/components/counterparts/CounterpartDetails/CounterpartView/CounterpartOrganizationView';
import { useMakeCounterpartContactDefault } from '@/core/queries';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import { Button, CardActions, Divider } from '@mui/material';

import { ConfirmDeleteDialogue } from '../../../ConfirmDeleteDialogue';
import { getIndividualName } from '../../../helpers';
import { printAddress } from '../../CounterpartAddressForm';
import { prepareCounterpartContact } from '../../CounterpartContactForm';
import {
  useCounterpartContactView,
  CounterpartContactViewProps,
} from './useCounterpartContactView';

export const CounterpartContactView = (props: CounterpartContactViewProps) => {
  const { i18n } = useLingui();
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const handleOpenDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const {
    firstName,
    lastName,
    phone,
    email,
    line1,
    line2,
    postalCode,
    city,
    country,
    state,
  } = prepareCounterpartContact(props.contact);

  const { deleteContact, onEdit, isLoading } = useCounterpartContactView(props);
  const { mutate } = useMakeCounterpartContactDefault();

  const makeDefault = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    return mutate({
      path: {
        counterpart_id: props.contact.counterpart_id,
        contact_id: props.contact.id,
      },
    });
  };

  const { isUpdateAllowed, isDeleteAllowed } = props.permissions;

  const actions = (isUpdateAllowed || isDeleteAllowed) && (
    <>
      {isUpdateAllowed && (
        <Button
          onClick={onEdit}
          variant="text"
          color="primary"
          size="small"
          startIcon={<EditIcon />}
        >
          {t(i18n)`Edit`}
        </Button>
      )}
      {isUpdateAllowed && !props.contact.is_default && (
        <Button
          onClick={makeDefault}
          variant="text"
          color="primary"
          size="small"
          startIcon={<StarIcon />}
        >
          {t(i18n)`Make default`}
        </Button>
      )}
      {isDeleteAllowed && !props.contact.is_default && (
        <Button
          onClick={handleOpenDeleteDialog}
          variant="text"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
        >
          {t(i18n)`Delete`}
        </Button>
      )}
    </>
  );

  return (
    <MoniteCard
      items={[
        {
          label: t(i18n)`Full name`,
          value: getIndividualName(firstName, lastName),
        },
        {
          label: t(i18n)`Address`,
          value: printAddress(
            {
              line1,
              line2,
              postalCode,
              city,
              country,
              state,
            },
            i18n
          ),
        },
        {
          label: t(i18n)`Phone number`,
          value: phone,
        },
        {
          label: t(i18n)`Email`,
          value: (
            <DefaultEmail email={email} isDefault={props.contact.is_default} />
          ),
        },
      ]}
    >
      {actions && (
        <>
          <Divider />
          <CardActions>{actions}</CardActions>
        </>
      )}
      <ConfirmDeleteDialogue
        isLoading={isLoading}
        onClose={handleCloseDeleteDialog}
        onDelete={deleteContact}
        type={t(i18n)`Contact Person`}
        name={getIndividualName(firstName, lastName)}
        open={showDeleteDialog}
      />
    </MoniteCard>
  );
};
