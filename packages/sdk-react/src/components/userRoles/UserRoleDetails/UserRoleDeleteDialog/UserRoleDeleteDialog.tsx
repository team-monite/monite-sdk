import { toast } from 'react-hot-toast';

import { useDialog } from '@/components/Dialog';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
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

export const UserRoleDeleteDialog = ({ id }: { id?: string }) => {
  const { api, queryClient } = useMoniteContext();
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

  const roleDeleteMutation = api.roles.deleteRolesId.useMutation(undefined, {
    onSuccess: async () => {
      await Promise.all([
        api.roles.getRoles.invalidateQueries(queryClient),
        api.roles.getRolesId.invalidateQueries(
          { parameters: { path: { role_id: id } } },
          queryClient
        ),
        api.entityUsers.getEntityUsers.invalidateQueries(
          { parameters: { query: { role_id: id } } },
          queryClient
        ),
      ]);
      toast.success(t(i18n)`Role has been deleted`);
    },
    onError: (error) => {
      toast.error(getAPIErrorMessage(i18n, error));
    },
  });

  const handleClickDelete = () => {
    if (!!id && !(users && users.data && users.data.length > 0)) {
      roleDeleteMutation.mutate(
        { path: { role_id: id } },
        {
          onSuccess: () => {
            dialogContext?.onClose?.();
          },
        }
      );
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
            disabled={roleDeleteMutation.isPending}
          >
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleClickDelete}
            disabled={roleDeleteMutation.isPending}
          >{t(i18n)`Delete`}</Button>
        </Stack>
      </DialogActions>
    </>
  );
};
