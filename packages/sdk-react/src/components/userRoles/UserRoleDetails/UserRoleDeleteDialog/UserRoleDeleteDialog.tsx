import { useDialog } from '@/components/Dialog';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';

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

  if (users && users.data && users.data.length > 0) {
    return (
      <>
        <DialogTitle variant="h3" id="responsive-dialog-title">
          {t(i18n)`To delete this role, remove it from all users`}
        </DialogTitle>
        <DialogActions>
          <Button variant="contained" onClick={dialogContext?.onClose}>{t(
            i18n
          )`Close`}</Button>
        </DialogActions>
      </>
    );
  }

  return (
    <>
      <DialogTitle variant="h3" id="responsive-dialog-title">
        {t(i18n)`Delete “${role?.name}”?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(i18n)`You can’t undo this action.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <Button
            autoFocus
            onClick={dialogContext?.onClose}
            disabled={isDeleting}
          >
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleClickDelete}
            disabled={isDeleting}
          >{t(i18n)`Delete`}</Button>
        </Stack>
      </DialogActions>
    </>
  );
};
