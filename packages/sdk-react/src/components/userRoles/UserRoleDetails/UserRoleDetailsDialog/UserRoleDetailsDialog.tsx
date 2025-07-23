import { useUserRoleQuery } from '../../useUserRoles';
import { UserRoleRow, UserRoleViewMode } from '../UserRoleRow/UserRoleRow';
import { StyledTableCell } from '../styles';
import { components } from '@/api';
import { UserCell } from '@/components/tags/TagsTable/UserCell/UserCell';
import {
  transformPermissionsToComponentFormat,
  createInitialPermissionsState,
} from '@/components/userRoles/UserRoleDetails/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { DialogFooter } from '@/ui/DialogFooter';
import { DialogHeader } from '@/ui/DialogHeader/DialogHeader';
import { LoadingPage } from '@/ui/loadingPage';
import { NotFound } from '@/ui/notFound';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  DialogContent,
  List,
  ListItem,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

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

interface UserRoleDetailsDialogProps {
  /** The id of the role to be displayed */
  id?: string;

  /** Callback fired on click of edit role button */
  onClickEditRole: () => void;

  /** Callback fired on click of delete role button */
  onClickDeleteRole: () => void;
}

export const UserRoleDetailsDialog = ({
  id,
  onClickEditRole,
  onClickDeleteRole,
}: UserRoleDetailsDialogProps) => {
  const { api } = useMoniteContext();
  const { i18n } = useLingui();
  const { data: user } = useEntityUserByAuthToken();

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

  const { isLoadingRole, isPendingRole, roleData, roleQueryError } =
    useUserRoleQuery({
      id,
    });

  const {
    isLoading: isLoadingUsers,
    isPending: isPendingUsers,
    data: users,
  } = api.entityUsers.getEntityUsers.useQuery(
    { query: { role_id: id ?? '' } },
    { enabled: !!id }
  );

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

  if (
    id &&
    (isLoadingRole || isPendingRole || isLoadingUsers || isPendingUsers)
  ) {
    return <LoadingPage />;
  }

  if (roleQueryError || !roleData) {
    return (
      <NotFound
        title={t(i18n)`Role not found`}
        description={t(i18n)`There is no role by provided id: ${id}`}
      />
    );
  }

  return (
    <>
      <DialogHeader
        title={roleData.name}
        closeButtonTooltip={t(i18n)`Close role details`}
      />
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
      <DialogFooter
        primaryButton={{
          label: t(i18n)`Edit`,
          onClick: onClickEditRole,
          isDisabled: !isUpdateAllowed,
        }}
        deleteButton={{
          label: t(i18n)`Delete`,
          onClick: onClickDeleteRole,
          isDisabled: !isDeleteAllowed,
        }}
      />
    </>
  );
};
