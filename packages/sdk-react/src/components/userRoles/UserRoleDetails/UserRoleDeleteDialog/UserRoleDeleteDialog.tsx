import { useDialog } from '@/components/Dialog';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { DialogActions, DialogTitle } from '@mui/material';
import { Button } from '@mui/material';

import { useUserRoleMutations } from '../../useUserRoles';

interface UserRoleDeleteDialogProps {
  id?: string;
  onDeleted: () => void;
}

export const UserRoleDeleteDialog = ({
  id,
  onDeleted,
}: UserRoleDeleteDialogProps) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();
  const dialogContext = useDialog();

  const { data: role } = api.roles.getRolesId.useQuery(
    { path: { role_id: id ?? '' } },
    { enabled: !!id }
  );

  const { data: users } = api.entityUsers.getEntityUsers.useQuery(
    { query: { role_id: id ?? '' } },
    { enabled: !!id }
  );

  const { deleteRole, isDeleting } = useUserRoleMutations({
    onDeleted,
  });

  const handleClickDelete = () => {
    if (!!id && !(users && users.data && users.data.length > 0)) {
      deleteRole(id);
    }
  };

  if (!dialogContext) {
    return null;
  }

  const handleClose = () => {
    dialogContext.onClose?.();
  };

  if (users && users.data && users.data.length > 0) {
    return (
      <>
        <DialogTitle variant="h3" id="responsive-dialog-title">
          {t(i18n)`To delete this role, remove it from all users`}
        </DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            {t(i18n)`Close`}
          </Button>
        </DialogActions>
      </>
    );
  }

  return (
    <ConfirmationModal
      open={true}
      title={t(i18n)`Delete "${role?.name}"?`}
      message={t(i18n)`You can't undo this action.`}
      confirmLabel={t(i18n)`Delete`}
      cancelLabel={t(i18n)`Cancel`}
      onClose={handleClose}
      onConfirm={handleClickDelete}
      isLoading={isDeleting}
    />
  );
};
