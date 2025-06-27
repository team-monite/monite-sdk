import { useCallback, useState } from 'react';

import { useVatTypeLabelByCode } from '@/core/hooks/useVatTypes';
import { getCountries } from '@/core/utils/countries';
import { MoniteCard } from '@/ui/Card/Card';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { CardActions, Button, Divider } from '@mui/material';

import {
  useCounterpartVatView,
  CounterpartVatViewProps,
} from './useCounterpartVatView';

export const CounterpartVatView = (props: CounterpartVatViewProps) => {
  const { i18n } = useLingui();
  const { deleteVat, onEdit, isLoading } = useCounterpartVatView(props);
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const {
    vat: { value, type, country },
  } = props;

  const vatType = useVatTypeLabelByCode(type);

  const { isUpdateAllowed, isDeleteAllowed } = props.permissions;

  const handleOpenDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  const handleDeleteVatId = useCallback(
    () => deleteVat(handleCloseDeleteDialog),
    [deleteVat, handleCloseDeleteDialog]
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
          label: t(i18n)`Country`,
          value: country && getCountries(i18n)[country],
        },
        {
          label: t(i18n)`VAT type`,
          value: vatType,
        },
        {
          label: t(i18n)`VAT value`,
          value,
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
        title={t(i18n)`Delete VAT ID “${value}“?`}
        message={t(i18n)`You can’t undo this action.`}
        confirmLabel={t(i18n)`Delete`}
        cancelLabel={t(i18n)`Cancel`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteVatId}
        isLoading={isLoading}
      />
    </MoniteCard>
  );
};
