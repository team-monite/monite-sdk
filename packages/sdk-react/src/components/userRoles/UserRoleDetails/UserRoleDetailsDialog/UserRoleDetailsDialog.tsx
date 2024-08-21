import { useState, useId } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components';
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
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
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

import { PermissionRow } from '../types';
import { getValidationSchema } from '../validation';
import { UserRoleRow } from './UserRoleRow';

/** View of the user role details */
export enum UserRoleDetailsView {
  /** Read mode - the user is only viewing the role details */
  Read = 'read',

  /** Mutate mode - the user is adding or editing the role */
  Mutate = 'mutate',
}

interface UserRoleFormValues {
  name: string;
  permissions: PermissionRow[];
}

interface UserRoleRequest {
  name: string;
  permissions: components['schemas']['BizObjectsSchema'];
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

const StyledDocLink = styled(Link)`
  display: flex;
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
    zIndex: '9999',
    fontWeight: '600',
    minWidth: '180px',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
}));

interface UserRoleDetailsDialogProps {
  role?: components['schemas']['RoleResponse'];
  onCreated?: (role: components['schemas']['RoleResponse']) => void;
  onUpdated?: (role: components['schemas']['RoleResponse']) => void;
}

export const UserRoleDetailsDialog = ({
  role,
  onCreated,
  onUpdated,
}: UserRoleDetailsDialogProps) => {
  const { i18n } = useLingui();
  const { api, queryClient } = useMoniteContext();
  const dialogContext = useDialog();
  const { data: user } = useEntityUserByAuthToken();

  const methods = useForm<UserRoleFormValues>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: {
      name: role?.name || '',
      permissions: role?.permissions.objects
        ? transformPermissionsToComponentFormat(role?.permissions.objects)
        : createInitialPermissionsState(),
    },
  });
  const { control, handleSubmit, reset, formState } = methods;
  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-UserRoles-${useId()}`;

  const [view, setView] = useState<UserRoleDetailsView>(
    role ? UserRoleDetailsView.Read : UserRoleDetailsView.Mutate
  );

  const roleCreateMutation = api.roles.postRoles.useMutation(
    {},
    {
      onSuccess: (role) =>
        Promise.all([
          api.roles.getRoles.invalidateQueries(queryClient),
          api.roles.getRolesId.invalidateQueries(
            { parameters: { path: { role_id: role.id } } },
            queryClient
          ),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );
  const roleUpdateMutation = api.roles.patchRolesId.useMutation(undefined, {
    onSuccess: (role) =>
      Promise.all([
        api.roles.getRoles.invalidateQueries(queryClient),
        api.roles.getRolesId.invalidateQueries(
          { parameters: { path: { role_id: role.id } } },
          queryClient
        ),
      ]),
    onError: (error) => {
      toast.error(getAPIErrorMessage(i18n, error));
    },
  });

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'role',
    action: 'update',
    entityUserId: user?.id,
  });

  const rows = role?.permissions.objects
    ? transformPermissionsToComponentFormat(role?.permissions.objects)
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
      headerName: t(i18n)`Resource name`,
    },
    {
      id: 'read',
      headerName: t(i18n)`Read`,
    },
    {
      id: 'create',
      headerName: t(i18n)`Create`,
    },
    {
      id: 'update',
      headerName: t(i18n)`Update`,
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
      headerName: t(i18n)`Create from mail`,
    },
  ];

  const createRole = (role: components['schemas']['CreateRoleRequest']) => {
    roleCreateMutation.mutate(
      { ...role },
      {
        onSuccess: (role) => {
          toast.success(t(i18n)`Role ${role.name} was created`);

          onCreated?.(role);
          setView(UserRoleDetailsView.Read);
        },
      }
    );
  };

  const updateRole = (
    roleId: string,
    req: components['schemas']['UpdateRoleRequest']
  ) => {
    roleUpdateMutation.mutate(
      { path: { role_id: roleId }, body: req },
      {
        onSuccess: (role) => {
          toast.success(t(i18n)`Role ${role.name} was updated`);

          onUpdated?.(role);
          setView(UserRoleDetailsView.Read);
        },
      }
    );
  };

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

    const roleId = role?.id;

    if (roleId) {
      return updateRole(roleId, formattedData);
    }

    return createRole(formattedData);
  };

  const handleCancel = () => {
    if (role) {
      setView(UserRoleDetailsView.Read);

      reset();

      return;
    }

    if (dialogContext?.isDialogContent) {
      dialogContext.onClose?.();
    }
  };

  return (
    <>
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h3" sx={{ wordBreak: 'break-word' }}>
            {role
              ? view === UserRoleDetailsView.Read
                ? role.name
                : t(i18n)`Edit User Role`
              : t(i18n)`Create User Role`}
          </Typography>
          {dialogContext?.isDialogContent && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={dialogContext.onClose}
              aria-label={t(i18n)`Close role details`}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <StyledDialogContainer>
        <FormProvider {...methods}>
          <form
            id={formName}
            noValidate
            onSubmit={handleSubmit(handleRoleFormSubmission)}
          >
            {view == UserRoleDetailsView.Mutate && (
              <RHFTextField
                label={t(i18n)`Name`}
                name="name"
                control={control}
                fullWidth
                required
              />
            )}
            <StyledTableTitle variant="subtitle2" mt={4} mb={1}>
              {t(i18n)`Permissions`}
              <StyledDocLink
                underline="none"
                rel="noopener noreferrer"
                href="https://docs.monite.com/docs/monite-account-structure#connect-entity-users"
                target="_blank"
              >
                {t(i18n)`Go to Docs`}
                &nbsp;
                <OpenInNewIcon />
              </StyledDocLink>
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
                      view={view}
                      row={row}
                      columns={columns}
                    />
                  ))}
                </TableBody>
              </Table>
            </StyledTableContainer>
          </form>
        </FormProvider>
      </StyledDialogContainer>
      <Divider />
      <DialogActions>
        {isUpdateAllowed && view === UserRoleDetailsView.Read && (
          <Button
            variant="outlined"
            onClick={() => setView(UserRoleDetailsView.Mutate)}
          >
            {t(i18n)`Edit`}
          </Button>
        )}
        {view === UserRoleDetailsView.Mutate && (
          <>
            <Button variant="outlined" color="inherit" onClick={handleCancel}>
              {t(i18n)`Cancel`}
            </Button>
            <Button
              variant="outlined"
              type="submit"
              form={formName}
              disabled={
                roleUpdateMutation.isPending ||
                roleCreateMutation.isPending ||
                (role && (!formState.isDirty || !isUpdateAllowed))
              }
            >
              {role ? t(i18n)`Update` : t(i18n)`Create`}
            </Button>
          </>
        )}
      </DialogActions>
    </>
  );
};
