import { useCallback, useEffect, useId } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';

import { components } from '@/api';
import {
  transformPermissionsToComponentFormat,
  createInitialPermissionsState,
  transformPermissionsToRequestFormat,
} from '@/components/userRoles/UserRoleDetails/helpers';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { FullScreenModalHeader } from '@/ui/FullScreenModalHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { RHFTextField } from '@/ui/RHF/RHFTextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  DialogContent,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { useUserRoleMutations, useUserRoleQuery } from '../../useUserRoles';
import { PermissionRow } from '../types';
import { UserRoleRow } from '../UserRoleRow';
import { UserRoleViewMode } from '../UserRoleRow/UserRoleRow';
import { getValidationSchema } from '../validation';

interface UserRoleFormValues {
  name: string;
  permissions: PermissionRow[];
}

interface UserRoleRequest {
  name: string;
  permissions: components['schemas']['BizObjectsSchema-Input'];
}

const StyledTableContainer = styled(TableContainer)`
  flex: 1;
  overflow: auto;
  min-height: 0;
`;

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: theme.palette.grey[300],
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.grey[100],
    whiteSpace: 'nowrap',
  },
  [`&.${tableCellClasses.head}:first-of-type`]: {
    position: 'sticky',
    left: 0,
    zIndex: '9999',
    minWidth: '180px',
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
  [`&.${tableCellClasses.body}:first-of-type`]: {
    position: 'sticky',
    left: 0,
    zIndex: '9998',
    fontWeight: '600',
    minWidth: '180px',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
}));

interface UserRoleEditDialogProps {
  /** The id of the role to be displayed */
  id?: string;
  onCreated: (role: components['schemas']['RoleResponse']) => void;
  onUpdated: (role: components['schemas']['RoleResponse']) => void;
  onClickDeleteRole: () => void;
}

export const UserRoleEditDialog = ({
  id,
  onCreated,
  onUpdated,
  onClickDeleteRole,
}: UserRoleEditDialogProps) => {
  const { i18n } = useLingui();
  const { data: user } = useEntityUserByAuthToken();

  const { isLoadingRole, isPendingRole, roleData, roleQueryError } =
    useUserRoleQuery({
      id,
    });
  const { createRole, updateRole, isCreating, isUpdating } =
    useUserRoleMutations({
      onCreated,
      onUpdated,
    });

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'role',
    action: 'update',
    entityUserId: user?.id,
  });

  const { data: isDeleteAllowed } = useIsActionAllowed({
    method: 'role',
    action: 'delete',
    entityUserId: user?.id,
  });

  const methods = useForm<UserRoleFormValues>({
    resolver: zodResolver(getValidationSchema(i18n)),
    defaultValues: {
      name: roleData?.name || '',
      permissions: roleData?.permissions.objects
        ? transformPermissionsToComponentFormat(roleData?.permissions.objects)
        : createInitialPermissionsState(),
    },
  });
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = methods;
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-UserRoles-${useId()}`;

  const onBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        // eslint-disable-next-line lingui/no-unlocalized-strings
        event.returnValue = 'Dirty state. Save changes before exiting.';
      }
    },
    [isDirty]
  );

  useEffect(() => {
    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, [onBeforeUnload]);

  const rows = roleData?.permissions.objects
    ? transformPermissionsToComponentFormat(roleData?.permissions.objects)
    : createInitialPermissionsState();

  const columns: {
    id:
      | 'name'
      | components['schemas']['ActionEnum']
      | components['schemas']['PayableActionEnum'];
    headerName: string;
    cellClassName?: string;
  }[] = [
    {
      id: 'name',
      headerName: t(i18n)`Permission`,
    },
    {
      id: 'read',
      headerName: t(i18n)`View`,
    },
    {
      id: 'create',
      headerName: t(i18n)`Create`,
    },
    {
      id: 'update',
      headerName: t(i18n)`Edit`,
    },
    {
      id: 'delete',
      headerName: t(i18n)`Delete`,
    },
    {
      id: 'submit',
      headerName: t(i18n)`Submit`,
    },
    {
      id: 'approve',
      headerName: t(i18n)`Approve`,
    },
    {
      id: 'pay',
      headerName: t(i18n)`Pay`,
    },
    {
      id: 'cancel',
      headerName: t(i18n)`Cancel`,
    },
    {
      id: 'reopen',
      headerName: t(i18n)`Reopen`,
    },
    {
      id: 'create_from_mail',
      headerName: t(i18n)`Create from email`,
    },
  ];

  const handleRoleFormSubmission: SubmitHandler<UserRoleFormValues> = (
    data
  ) => {
    const formattedData: UserRoleRequest = {
      name: data.name,
      permissions: transformPermissionsToRequestFormat(data.permissions),
    };

    if (roleData?.id) {
      return updateRole(roleData.id, formattedData);
    }

    return createRole(formattedData);
  };

  const title = id ? t(i18n)`Edit user role` : t(i18n)`Create user role`;

  const actions = (
    <>
      {id && isDeleteAllowed && (
        <Button
          variant="text"
          color="error"
          onClick={onClickDeleteRole}
          disabled={isCreating || isUpdating}
        >
          {t(i18n)`Delete`}
        </Button>
      )}
      <Button
        variant="contained"
        type="submit"
        form={formName}
        disabled={!isDirty || isCreating || isUpdating || !isUpdateAllowed}
      >
        {t(i18n)`Save`}
      </Button>
    </>
  );

  if (id && (isLoadingRole || isPendingRole)) {
    return <LoadingPage />;
  }

  if (roleQueryError) {
    return (
      <NotFound
        title={t(i18n)`Role not found`}
        description={t(i18n)`There is no role by provided id: ${id}`}
      />
    );
  }

  return (
    <>
      <FullScreenModalHeader
        title={title}
        actions={actions}
        closeButtonTooltip={t(i18n)`Close role editor`}
      />
      <DialogContent dividers>
        <FormProvider {...methods}>
          <form
            id={formName}
            noValidate
            onSubmit={handleSubmit(handleRoleFormSubmission)}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Stack
              direction="column"
              alignItems="stretch"
              spacing={2}
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <RHFTextField
                control={control}
                name="name"
                label={t(i18n)`Name`}
                required
              />
              <Typography variant="subtitle2">
                {t(i18n)`Permissions`}
              </Typography>
              <StyledTableContainer>
                <Table stickyHeader>
                  <StyledTableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <StyledTableCell key={column.id}>
                          {column.headerName}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  </StyledTableHead>
                  <TableBody>
                    {rows.map((row, index) => (
                      <UserRoleRow
                        key={row.name}
                        row={row}
                        view={UserRoleViewMode.Mutate}
                        columns={columns}
                        index={index}
                      />
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Stack>
          </form>
        </FormProvider>
      </DialogContent>
    </>
  );
};
