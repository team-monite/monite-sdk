import { useCallback, useState } from 'react';

import { getCountries } from '@/core/utils/countries';
import { getCurrencies } from '@/core/utils/currencies';
import { MoniteCard } from '@/ui/Card/Card';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { CardActions, Button, Divider } from '@mui/material';

import { ConfirmDeleteDialog } from '../../../components/ConfirmDeleteDialog';
import {
  useCounterpartBankView,
  CounterpartBankViewProps,
} from './useCounterpartBankView';

export const CounterpartBankView = (props: CounterpartBankViewProps) => {
  const { i18n } = useLingui();
  const { deleteBank, onEdit, isLoading } = useCounterpartBankView(props);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);
  const { isUpdateAllowed, isDeleteAllowed } = props.permissions;

  const {
    bank: {
      name,
      bic,
      iban,
      currency,
      country,
      account_number,
      account_holder_name,
      sort_code,
      routing_number,
    },
  } = props;

  const handleOpenDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const handleDeleteBankAccount = useCallback(
    () => deleteBank(handleCloseDeleteDialog),
    [deleteBank, handleCloseDeleteDialog]
  );

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
      {isDeleteAllowed && (
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
          label: t(i18n)`Display name`,
          value: name,
        },
        {
          label: t(i18n)`SWIFT/BIC code`,
          value: bic,
        },
        {
          label: t(i18n)`IBAN`,
          value: iban,
        },
        {
          label: t(i18n)`Account number`,
          value: account_number,
        },
        {
          label: t(i18n)`Account holder name`,
          value: account_holder_name,
        },
        {
          label: t(i18n)`Sort code`,
          value: sort_code,
        },
        {
          label: t(i18n)`Routing number`,
          value: routing_number,
        },
        {
          label: t(i18n)`Country`,
          value: getCountries(i18n)[country],
        },
        {
          label: t(i18n)`Currency`,
          value: getCurrencies(i18n)[currency],
        },
      ]}
    >
      {actions && (
        <>
          <Divider />
          <CardActions>{actions}</CardActions>
        </>
      )}
      <ConfirmationModal
        open={showDeleteDialog}
        title={t(i18n)`Delete Bank Account “${name}“?`}
        message={t(i18n)`You can’t undo this action.`}
        confirmLabel={t(i18n)`Delete`}
        cancelLabel={t(i18n)`Cancel`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteBankAccount}
        isLoading={isLoading}
      />
    </MoniteCard>
  );
};
