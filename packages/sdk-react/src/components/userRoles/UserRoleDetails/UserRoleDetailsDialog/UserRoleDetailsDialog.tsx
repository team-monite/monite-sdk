import React, { useState, useId, useCallback } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useDialog } from '@/components';
import { RHFTextField } from '@/components/RHF/RHFTextField';
import { useEntityUserByAuthToken } from '@/core/queries';
import {
  COMMON_PERMISSIONS_OBJECTS_TYPES,
  PAYABLE_PERMISSIONS_OBJECTS_TYPES,
  commonPermissionsObjectType,
  payablePermissionsObjectType,
  useIsActionAllowed,
} from '@/core/queries/usePermissions';
import {
  useRoleById,
  useUpdateRole,
  UserRoleRequest,
  UserRolePayablePermissions,
  UserRoleCommonPermissions,
  useCreateRole,
} from '@/core/queries/useRoles';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ActionEnum,
  CreateRoleRequest,
  PayableActionEnum,
  PermissionEnum,
  RoleResponse,
  RootSchema,
  UpdateRoleRequest,
} from '@monite/sdk-api';
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

import { getValidationSchema } from '../validation';
import { UserRoleRow } from './UserRoleRow';

export type CommonActions = {
  [key in ActionEnum]?: boolean;
};

export type PayableActions = {
  [key in PayableActionEnum]?: boolean;
};

interface CommonPermissionRow extends CommonActions {
  name?: commonPermissionsObjectType;
}

interface PayablePermissionRow extends PayableActions {
  name?: payablePermissionsObjectType;
}

export type PermissionRow = CommonPermissionRow | PayablePermissionRow;

interface ExistingUserRoleDetailsProps {
  /** The id of the role to be displayed */
  id?: string;

  /**
   * Callback is fired when a role is created and sync with server is successful
   *
   * @param role
   */
  onCreated?: (role: RoleResponse) => void;

  /**
   * Callback is fired when a role is updated and sync with server is successful
   *
   * @param role
   */
  onUpdated?: (role: RoleResponse) => void;
}

/** View of the user role details */
export enum UserRoleDetailsView {
  /** Read mode - the user is only viewing the role details */
  Read = 'read',

  /** Edit mode - the user is editing the role details */
  Edit = 'edit',
}

interface UserRoleFormValues {
  name: string;
  permissions: PermissionRow[];
}

const validatePermission = (permission?: PermissionEnum) => {
  return (
    permission === PermissionEnum.ALLOWED ||
    permission === PermissionEnum.ALLOWED_FOR_OWN
  );
};

function isCommonPermissionObjectType(
  objectType: string
): objectType is commonPermissionsObjectType {
  return COMMON_PERMISSIONS_OBJECTS_TYPES.includes(
    objectType as commonPermissionsObjectType
  );
}

function isPayablePermissionObjectType(
  objectType: string
): objectType is payablePermissionsObjectType {
  return PAYABLE_PERMISSIONS_OBJECTS_TYPES.includes(
    objectType as payablePermissionsObjectType
  );
}

const normalizePermissions = (objects: RootSchema[]): PermissionRow[] => {
  return objects
    .map((object) => {
      if (object.object_type) {
        if (isCommonPermissionObjectType(object.object_type)) {
          let permission: CommonPermissionRow = {};

          permission.name = object.object_type;

          object.actions?.forEach((action) => {
            const actionName = action.action_name;

            if (actionName) {
              if (
                Object.values(ActionEnum).includes(actionName as ActionEnum)
              ) {
                permission[actionName as ActionEnum] = validatePermission(
                  action.permission
                );
              }
            }
          });

          return permission;
        }

        if (isPayablePermissionObjectType(object.object_type)) {
          let permission: PayablePermissionRow = {};

          permission.name = object.object_type;

          object.actions?.forEach((action) => {
            const actionName = action.action_name;

            if (actionName) {
              if (
                Object.values(PayableActionEnum).includes(
                  actionName as PayableActionEnum
                )
              ) {
                permission[actionName as PayableActionEnum] =
                  validatePermission(action.permission);
              }
            }
          });

          return permission;
        }
      }

      return null;
    })
    .filter(
      (permission): permission is CommonPermissionRow | PayablePermissionRow =>
        permission !== null
    );
};

const generateEmptyPermissions = (): PermissionRow[] => {
  return [
    ...PAYABLE_PERMISSIONS_OBJECTS_TYPES.map((objectType) => {
      let permission: PayablePermissionRow = {};

      permission.name = objectType;

      Object.values(PayableActionEnum).forEach((action) => {
        permission[action] = false;
      });

      return permission;
    }),
    ...COMMON_PERMISSIONS_OBJECTS_TYPES.map((objectType) => {
      let permission: CommonPermissionRow = {};

      permission.name = objectType;

      Object.values(ActionEnum).forEach((action) => {
        permission[action] = false;
      });

      return permission;
    }),
  ];
};

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

export const UserRoleDetailsDialog = ({
  id,
  onCreated,
  onUpdated,
}: ExistingUserRoleDetailsProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { data: user } = useEntityUserByAuthToken();
  const [roleId, setRoleId] = useState<string | undefined>(id);

  const { data: role } = useRoleById(roleId);

  const methods = useForm<UserRoleFormValues>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: {
      name: role?.name || '',
      permissions: role?.permissions.objects
        ? normalizePermissions(role?.permissions.objects)
        : generateEmptyPermissions(),
    },
  });
  const { control, handleSubmit, reset, formState } = methods;
  const formId = useId();

  const [view, setView] = useState<UserRoleDetailsView>(
    role ? UserRoleDetailsView.Read : UserRoleDetailsView.Edit
  );

  const updateRoleMutation = useUpdateRole(role?.id);
  const createRoleMutation = useCreateRole();

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'role',
    action: ActionEnum.UPDATE,
    entityUserId: user?.id,
  });

  const rows = role?.permissions.objects
    ? normalizePermissions(role?.permissions.objects)
    : generateEmptyPermissions();

  const columns: {
    id: 'name' | ActionEnum | PayableActionEnum;
    headerName: string;
    cellClassName?: string;
  }[] = [
    {
      id: 'name',
      headerName: t(i18n)`Resource name`,
      cellClassName: 'role-data-grid--cell',
    },
    {
      id: ActionEnum.READ,
      headerName: t(i18n)`Read`,
    },
    {
      id: ActionEnum.CREATE,
      headerName: t(i18n)`Create`,
    },
    {
      id: ActionEnum.UPDATE,
      headerName: t(i18n)`Update`,
    },
    {
      id: ActionEnum.DELETE,
      headerName: t(i18n)`Delete`,
    },
    {
      id: PayableActionEnum.SUBMIT,
      headerName: t(i18n)`Submit`,
    },
    {
      id: PayableActionEnum.APPROVE,
      headerName: t(i18n)`Approve`,
    },
    {
      id: PayableActionEnum.PAY,
      headerName: t(i18n)`Pay`,
    },
    {
      id: PayableActionEnum.CANCEL,
      headerName: t(i18n)`Cancel`,
    },
    {
      id: PayableActionEnum.REOPEN,
      headerName: t(i18n)`Reopen`,
    },
    {
      id: PayableActionEnum.CREATE_FROM_MAIL,
      headerName: t(i18n)`Create from mail`,
    },
  ];

  const createRole = useCallback(
    (role: CreateRoleRequest) => {
      createRoleMutation.mutate(role, {
        onSuccess: (role) => {
          setRoleId(role.id);
          onCreated?.(role);
          setView(UserRoleDetailsView.Read);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });
    },
    [createRoleMutation, onUpdated]
  );

  const updateRole = useCallback(
    (roleId: string, req: UpdateRoleRequest) => {
      updateRoleMutation.mutate(
        { roleId, payload: req },
        {
          onSuccess: (role) => {
            onUpdated?.(role);
            setView(UserRoleDetailsView.Read);
          },
        }
      );
    },
    [updateRoleMutation, onUpdated]
  );

  const onSubmit: SubmitHandler<UserRoleFormValues> = (data) => {
    const formattedData: UserRoleRequest = {
      name: data.name,
      permissions: {
        objects: data.permissions
          .map((permission) => {
            const objectType = permission.name;

            if (objectType && isCommonPermissionObjectType(objectType)) {
              return {
                object_type: objectType,
                actions: Object.entries(permission)
                  .filter(([key]) => key !== 'name')
                  .map(([action, permission]) => {
                    return {
                      action_name: action as ActionEnum,
                      permission: permission
                        ? PermissionEnum.ALLOWED
                        : PermissionEnum.NOT_ALLOWED,
                    };
                  }),
              };
            }

            if (objectType && isPayablePermissionObjectType(objectType)) {
              return {
                object_type: objectType,
                actions: Object.entries(permission)
                  .filter(([key]) => key !== 'name')
                  .map(([action, permission]) => {
                    return {
                      action_name: action as PayableActionEnum,
                      permission: permission
                        ? PermissionEnum.ALLOWED
                        : PermissionEnum.NOT_ALLOWED,
                    };
                  }),
              };
            }

            return null;
          })
          .filter(
            (
              permission
            ): permission is
              | UserRoleCommonPermissions
              | UserRolePayablePermissions => permission !== null
          ),
      },
    };

    const roleId = role?.id;

    /*
     * Generated types UpdateRoleRequest & CreateRoleRequest don't describe the real payload
     * due to limitations of the current type generation library.
     * We have to cast formattedData to UpdateRoleRequest to avoid type errors.
     * The problem should be fixed when the sdk will use the Qraft library.
     * */
    if (roleId) {
      return updateRole(roleId, formattedData as unknown as UpdateRoleRequest);
    }

    return createRole(formattedData as unknown as CreateRoleRequest);
  };

  const handleCancel = () => {
    if (roleId) {
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
            id={`Monite-Form-UserRoles-${formId}`}
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            {view == UserRoleDetailsView.Edit && (
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
            onClick={() => setView(UserRoleDetailsView.Edit)}
          >
            {t(i18n)`Edit`}
          </Button>
        )}
        {view === UserRoleDetailsView.Edit && (
          <>
            <Button variant="outlined" color="inherit" onClick={handleCancel}>
              {t(i18n)`Cancel`}
            </Button>
            <Button
              variant="outlined"
              type="submit"
              form={`Monite-Form-UserRoles-${formId}`}
              disabled={
                updateRoleMutation.isPending ||
                createRoleMutation.isPending ||
                (!!roleId && (!formState.isDirty || !isUpdateAllowed))
              }
            >
              {roleId ? t(i18n)`Update` : t(i18n)`Create`}
            </Button>
          </>
        )}
      </DialogActions>
    </>
  );
};
