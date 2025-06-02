import { useFormContext } from 'react-hook-form';

import { components } from '@/api';
import { getPermissionToLabelMap } from '@/components/userRoles/consts';
import { RHFCheckbox } from '@/ui/RHF/RHFCheckbox';
import { useLingui } from '@lingui/react';
import {
  CheckRounded as CheckRoundedIcon,
  CloseRounded as CloseRoundedIcon,
} from '@mui/icons-material';
import { TableRow } from '@mui/material';

import { CommonActions, PayableActions, PermissionRow } from '../types';
import { UserRoleViewMode } from '../UserRole.types';
import { StyledTableCell } from '../UserRoleTableComponents'; // Add this

interface UserRoleRowProps {
  /** The row data to be displayed */
  row: PermissionRow;
  /** The row index */
  index: number;
  /** The columns of the table for role details */
  columns: {
    id:
      | 'name'
      | components['schemas']['ActionEnum']
      | components['schemas']['PayableActionEnum'];
  }[];
  /** The view of the user role details */
  view: UserRoleViewMode;
}

interface ActionPermissionCellProps {
  view: UserRoleViewMode;
  rowIndex: number;
  rowName?: string;
  action: keyof CommonActions | keyof PayableActions;
  actionPermissionValue: boolean | undefined;
}

interface ActionPermissionCellCheckboxProps {
  name: string;
  label: string;
}

const ActionPermissionCellCheckbox = ({
  name,
  label,
}: ActionPermissionCellCheckboxProps) => {
  const { control } = useFormContext();

  return <RHFCheckbox control={control} name={name} aria-label={label} />;
};

const ActionPermissionCell = ({
  view,
  rowIndex,
  rowName,
  action,
  actionPermissionValue,
}: ActionPermissionCellProps) => {
  if (typeof actionPermissionValue !== 'boolean') return null;

  if (view === UserRoleViewMode.Mutate) {
    return (
      <ActionPermissionCellCheckbox
        name={`permissions[${rowIndex}][${action}]`}
        label={`${rowName} ${action}`}
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
  const actionPermissionsColumns = columns.filter(
    (column) => column.id !== 'name'
  ) as {
    id:
      | components['schemas']['ActionEnum']
      | components['schemas']['PayableActionEnum'];
  }[];

  return (
    <TableRow>
      <StyledTableCell>
        {row.name && getPermissionToLabelMap(i18n)[row.name]}
      </StyledTableCell>
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
              rowName={row.name}
              action={action}
              actionPermissionValue={actionPermissionValue}
            />
          </StyledTableCell>
        );
      })}
    </TableRow>
  );
};
