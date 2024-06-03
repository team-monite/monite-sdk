import React from 'react';
import { useFormContext } from 'react-hook-form';

import { RHFCheckbox } from '@/components/RHF/RHFCheckbox';
import { getPermissionToLabelMap } from '@/components/userRoles/consts';
import { useLingui } from '@lingui/react';
import { ActionEnum, PayableActionEnum } from '@monite/sdk-api';
import {
  CheckRounded as CheckRoundedIcon,
  CloseRounded as CloseRoundedIcon,
} from '@mui/icons-material';
import { TableRow } from '@mui/material';

import {
  UserRoleDetailsView,
  StyledTableCell,
  CommonActions,
  PayableActions,
  PermissionRow,
} from '../UserRoleDetailsDialog';

interface UserRoleRowProps {
  /** The row data to be displayed */
  row: PermissionRow;
  /** The row index */
  index: number;
  /** The columns of the table for role details */
  columns: { id: 'name' | ActionEnum | PayableActionEnum }[];
  /** The view of the user role details */
  view: UserRoleDetailsView;
}

interface ActionPermissionCellProps {
  view: UserRoleDetailsView;
  rowIndex: number;
  action: keyof CommonActions | keyof PayableActions;
  actionPermissionValue: boolean | undefined;
}

const ActionPermissionCell = ({
  view,
  rowIndex,
  action,
  actionPermissionValue,
}: ActionPermissionCellProps) => {
  const { control } = useFormContext();

  if (typeof actionPermissionValue !== 'boolean') return null;

  if (view === UserRoleDetailsView.Edit) {
    return (
      <RHFCheckbox
        control={control}
        label=""
        name={`permissions[${rowIndex}][${action}]`}
      />
    );
  }

  if (actionPermissionValue) return <CheckRoundedIcon color="primary" />;

  return <CloseRoundedIcon color="secondary" />;
};

export const UserRoleRow = ({
  view,
  row,
  index: rowIndex,
  columns,
}: UserRoleRowProps) => {
  const { i18n } = useLingui();
  const fixedLabelColumn = columns.slice(0, 1);
  const actionPermissionsColumns = columns.slice(1) as {
    id: ActionEnum | PayableActionEnum;
  }[];

  return (
    <TableRow>
      {fixedLabelColumn.map((column) => (
        <StyledTableCell key={column.id}>
          {row.name && getPermissionToLabelMap(i18n)[row.name]}
        </StyledTableCell>
      ))}
      {actionPermissionsColumns.map((column) => {
        const action = column.id;
        const actionPermissionValue = (
          row as { [key: string]: boolean | undefined }
        )[action];

        return (
          <StyledTableCell key={column.id} align="center">
            <ActionPermissionCell
              view={view}
              rowIndex={rowIndex}
              action={action}
              actionPermissionValue={actionPermissionValue}
            />
          </StyledTableCell>
        );
      })}
    </TableRow>
  );
};
