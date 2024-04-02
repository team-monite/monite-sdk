import React from 'react';

import { useDialog } from '@/components';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  RoleResponse,
  RootSchema,
  PayableActionEnum,
  ActionEnum,
  PermissionEnum,
  CommonSchema,
  PayableSchema,
} from '@monite/sdk-api';
import {
  Close as CloseIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  styled,
  Box,
  DialogTitle,
  DialogContent,
  Divider,
  IconButton,
  Typography,
  Link,
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  tableCellClasses,
} from '@mui/material';

import { UserRoleRow } from './UserRoleRow';

export type Actions = {
  [key in ActionEnum | PayableActionEnum]?: boolean;
};

export type PermissionRow = Actions & {
  name?: (CommonSchema | PayableSchema)['object_type'];
};

interface ExistingUserRoleDetailsProps {
  /** Role to be displayed */
  role: RoleResponse;
}

const validatePermission = (permission?: PermissionEnum) => {
  return (
    permission === PermissionEnum.ALLOWED ||
    permission === PermissionEnum.ALLOWED_FOR_OWN
  );
};

const normalizePermissions = (objects: RootSchema[]) => {
  return objects.map((object) => {
    const permission: PermissionRow = {};

    if (object.object_type) permission.name = object.object_type;

    object.actions?.forEach((action) => {
      if (action.action_name) {
        permission[action.action_name] = validatePermission(action.permission);
      }
    });

    return permission;
  });
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
  [`&.${tableCellClasses.head}:first-child`]: {
    position: 'sticky',
    left: 0,
    zIndex: '9999',
    minWidth: '180px',
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
  [`&.${tableCellClasses.body}:first-child`]: {
    position: 'sticky',
    left: 0,
    fontWeight: '600',
    minWidth: '180px',
    backgroundColor: theme.palette.background.default,
    borderRight: `1px solid ${theme.palette.grey[300]}`,
  },
}));

export const ExistingUserRoleDetails = ({
  role,
}: ExistingUserRoleDetailsProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();

  const rows = role.permissions.objects
    ? normalizePermissions(role.permissions.objects)
    : [];
  const columns = [
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

  return (
    <MoniteStyleProvider>
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h3" sx={{ wordBreak: 'break-word' }}>
            {role?.name}
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
        {role.permissions.objects && (
          <StyledTableContainer>
            <Table stickyHeader>
              <StyledTableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <StyledTableCell key={column.id}>
                      {column.headerName}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {rows.map((row) => (
                  <UserRoleRow key={row.name} row={row} columns={columns} />
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        )}
      </StyledDialogContainer>
    </MoniteStyleProvider>
  );
};
