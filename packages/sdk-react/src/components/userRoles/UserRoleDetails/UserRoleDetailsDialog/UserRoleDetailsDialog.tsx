import { components } from '@/api';
import { useDialog } from '@/components';
import { UserCell } from '@/components/tags/TagsTable/UserCell/UserCell';
import {
  transformPermissionsToComponentFormat,
  createInitialPermissionsState,
} from '@/components/userRoles/UserRoleDetails/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { IconWrapper } from '@/ui/iconWrapper';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Paper,
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

import { UserRoleRow, UserRoleViewMode } from '../UserRoleRow/UserRoleRow';

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

interface UserRoleDetailsDialogProps {
  /** The id of the role to be displayed */
  id?: string;

  /**
   * Callback fired on click of edit role button
   *
   */
  onClickEditRole: () => void;
}

export const UserRoleDetailsDialog = ({
  id,
  onClickEditRole,
}: UserRoleDetailsDialogProps) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { data: user } = useEntityUserByAuthToken();

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'role',
    action: 'update',
    entityUserId: user?.id,
  });

  const {
    isLoading: isLoadingRole,
    isPending: isPendingRole,
    data: role,
    error: roleQueryError,
  } = api.roles.getRolesId.useQuery(
    { path: { role_id: id ?? '' } },
    { enabled: !!id }
  );

  const {
    isLoading: isLoadingUsers,
    isPending: isPendingUsers,
    data: users,
  } = api.entityUsers.getEntityUsers.useQuery(
    { query: { role_id: id ?? '' } },
    { enabled: !!id }
  );

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

  if (
    id &&
    (isLoadingRole || isPendingRole || isLoadingUsers || isPendingUsers)
  ) {
    return <LoadingPage />;
  }

  if (roleQueryError || !role) {
    return (
      <NotFound
        title={t(i18n)`Role not found`}
        description={t(i18n)`There is no role by provided id: ${id}`}
      />
    );
  }

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
            {role.name}
          </Typography>
          {dialogContext?.isDialogContent && (
            <IconWrapper
              edge="start"
              color="inherit"
              onClick={dialogContext.onClose}
              aria-label={t(i18n)`Close role details`}
            >
              <CloseIcon />
            </IconWrapper>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <StyledDialogContainer>
        <Stack
          direction="column"
          alignItems="stretch"
          sx={{ width: '100%', maxHeight: '100%' }}
        >
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
                    view={UserRoleViewMode.Read}
                    row={row}
                    columns={columns}
                  />
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
        </Stack>
        <Stack mt={2}>
          <Typography variant="subtitle2" my={1}>
            {t(i18n)`Users`}
          </Typography>
          <Paper variant="outlined">
            <Stack
              p={2}
              direction="row"
              alignItems="start"
              justifyContent={'space-between'}
            >
              <Box flexShrink={0} pr={2}>{t(i18n)`Users with this role`}</Box>
              <Box flexGrow={1} overflow={'scroll'}>
                {users && users.data && users.data.length > 0 ? (
                  <List disablePadding>
                    {users.data.map((user) => (
                      <ListItem key={user.id}>
                        <UserCell id={user.id} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  t(i18n)`None`
                )}
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </StyledDialogContainer>
      {isUpdateAllowed && (
        <>
          <Divider />
          <DialogActions>
            <Stack direction="row" spacing={2}>
              <Button color="error">{t(i18n)`Delete`}</Button>
              <Button variant="outlined" onClick={onClickEditRole}>{t(
                i18n
              )`Edit`}</Button>
            </Stack>
          </DialogActions>
        </>
      )}
    </>
  );
};
