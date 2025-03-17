import { useCallback, useEffect, useId } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';

import { components } from '@/api';
import { useDialog } from '@/components/Dialog';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import {
  transformPermissionsToComponentFormat,
  isCommonPermissionObjectType,
  isPayablePermissionObjectType,
  createInitialPermissionsState,
} from '@/components/userRoles/UserRoleDetails/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  AppBar,
  Button,
  DialogContent,
  IconButton,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
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

const StyledDialogContainer = styled(DialogContent)`
  display: flex;
  flex-direction: column;
`;

const StyledTableTitle = styled(Typography)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledTableContainer = styled(TableContainer)`
  min-height: 300px;
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
  onCreated?: (role: components['schemas']['RoleResponse']) => void;
  onUpdated?: (role: components['schemas']['RoleResponse']) => void;
}

export const UserRoleEditDialog = ({
  id,
  onCreated,
  onUpdated,
}: UserRoleEditDialogProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
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

  const methods = useForm<UserRoleFormValues>({
    resolver: yupResolver(getValidationSchema(i18n)),
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
      permissions: {
        objects: data.permissions
          .map((permission) => {
            const objectType = permission.name;

            if (!objectType) return null;

            if (isCommonPermissionObjectType(objectType)) {
              return {
                object_type: objectType,
                actions: Object.entries(permission)
                  .filter(([key]) => key !== 'name')
                  .map(([action, permission]) => {
                    return {
                      action_name:
                        action as components['schemas']['ActionEnum'],
                      permission: (permission
                        ? 'allowed'
                        : 'not_allowed') as components['schemas']['PermissionEnum'],
                    };
                  }),
              };
            }

            if (isPayablePermissionObjectType(objectType)) {
              return {
                object_type: objectType,
                actions: Object.entries(permission)
                  .filter(([key]) => key !== 'name')
                  .map(([action, permission]) => {
                    return {
                      action_name:
                        action as components['schemas']['PayableActionEnum'],
                      permission: (permission
                        ? 'allowed'
                        : 'not_allowed') as components['schemas']['PermissionEnum'],
                    };
                  }),
              };
            }
          })
          .filter(
            <T,>(value: T | null | undefined): value is T =>
              value !== null && value !== undefined
          ),
      },
    };

    if (role?.id) {
      return updateRole(role.id, formattedData);
    }

    return createRole(formattedData);
  };

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
      <AppBar position="relative" color="inherit" sx={{ borderRadius: '0' }}>
        <Toolbar>
          {dialogContext?.isDialogContent && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={dialogContext.onClose}
              aria-label={t(i18n)`Close role edit`}
            >
              <CloseIcon />
            </IconButton>
          )}
          <Typography variant="h3" flex={1} ml={2}>
            {roleData ? t(i18n)`Edit User Role` : t(i18n)`Create User Role`}
          </Typography>
          <Button
            type="submit"
            form={formName}
            disabled={
              isUpdating ||
              isCreating ||
              (roleData && (!isDirty || !isUpdateAllowed))
            }
            autoFocus
            color="primary"
            variant="contained"
          >
            {t(i18n)`Save`}
          </Button>
        </Toolbar>
      </AppBar>

      <StyledDialogContainer>
        <FormProvider {...methods}>
          <form
            id={formName}
            noValidate
            onSubmit={handleSubmit(handleRoleFormSubmission)}
            style={{ maxHeight: '100%' }}
          >
            <Stack
              direction="column"
              alignItems="stretch"
              sx={{ width: '100%', height: '100%' }}
            >
              <RHFTextField
                label={t(i18n)`Name`}
                name="name"
                control={control}
                fullWidth
                required
              />
              <StyledTableTitle variant="subtitle2" my={1}>
                {t(i18n)`Permissions`}
              </StyledTableTitle>
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
                        index={index}
                        view={UserRoleViewMode.Mutate}
                        row={row}
                        columns={columns}
                      />
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>
            </Stack>
          </form>
        </FormProvider>
      </StyledDialogContainer>
    </>
  );
};
