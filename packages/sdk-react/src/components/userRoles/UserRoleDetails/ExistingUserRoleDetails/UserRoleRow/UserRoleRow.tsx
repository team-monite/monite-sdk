import React from 'react';

import { getPermissionToLabelMap } from '@/components/userRoles/consts';
import { useLingui } from '@lingui/react';
import {
  CheckRounded as CheckRoundedIcon,
  CloseRounded as CloseRoundedIcon,
} from '@mui/icons-material';
import { TableRow } from '@mui/material';

import {
  StyledTableCell,
  Actions,
  PermissionRow,
} from '../ExistingUserRoleDetails';

interface UserRoleRowProps {
  /** The row data to be displayed */
  row: PermissionRow;
  /** The columns of the table for role details */
  columns: { id: string }[];
}

interface ActionPermissionCellProps {
  actionPermission: boolean | undefined;
}

const ActionPermissionCell = ({
  actionPermission,
}: ActionPermissionCellProps) => {
  if (typeof actionPermission !== 'boolean') return null;

  if (actionPermission) return <CheckRoundedIcon color="primary" />;

  return <CloseRoundedIcon color="secondary" />;
};

export const UserRoleRow = ({ row, columns }: UserRoleRowProps) => {
  const { i18n } = useLingui();
  const fixedLabelColumn = columns.slice(0, 1);
  const actionPermissionsColumns = columns.slice(1);

  return (
    <TableRow>
      {fixedLabelColumn.map((column) => (
        <StyledTableCell key={column.id}>
          {row.name && getPermissionToLabelMap(i18n)[row.name]}
        </StyledTableCell>
      ))}
      {actionPermissionsColumns.map((column) => {
        const action = column.id as keyof Actions;
        const actionPermission = row[action];

        return (
          <StyledTableCell key={column.id} align="center">
            <ActionPermissionCell actionPermission={actionPermission} />
          </StyledTableCell>
        );
      })}
    </TableRow>
  );
};
