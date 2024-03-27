import React, { useCallback, useState } from 'react';

import { getCountries } from '@/core/utils/countries';
import { useVatTypeLabelByCode } from '@/core/utils/useVatTypes';
import { MoniteCard } from '@/ui/Card/Card';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import { CardActions, Button, Divider } from '@mui/material';

import { ConfirmDeleteDialogue } from '../../../ConfirmDeleteDialogue';
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
          label: t(i18n)`Vat type`,
          value: vatType,
        },
        {
          label: t(i18n)`Vat value`,
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
      <ConfirmDeleteDialogue
        isLoading={isLoading}
        onClose={handleCloseDeleteDialog}
        onDelete={handleDeleteVatId}
        type={t(i18n)`Vat ID`}
        name={value ? value : ''}
        open={showDeleteDialog}
      />
    </MoniteCard>
  );
};
