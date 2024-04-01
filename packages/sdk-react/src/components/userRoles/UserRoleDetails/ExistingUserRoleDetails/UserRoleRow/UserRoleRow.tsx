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

export const UserRoleRow = ({ row, columns }: UserRoleRowProps) => {
  const { i18n } = useLingui();

  return (
    <TableRow>
      {/* render the first column as a fixed label of the row */}
      {columns.slice(0, 1).map((column) => (
        <StyledTableCell key={column.id}>
          {row.name && getPermissionToLabelMap(i18n)[row.name]}
        </StyledTableCell>
      ))}
      {/* render the rest of the permissions as cells with icons.
      It should be empty in case of action permission is undefined.*/}
      {columns.slice(1).map((column) => {
        const action = column.id as keyof Actions;
        const actionPermission = row[action];

        return (
          <StyledTableCell key={column.id}>
            {typeof actionPermission === 'boolean' ? (
              actionPermission ? (
                <CheckRoundedIcon color="primary" />
              ) : (
                <CloseRoundedIcon color="secondary" />
              )
            ) : null}
          </StyledTableCell>
        );
      })}
    </TableRow>
  );
};
