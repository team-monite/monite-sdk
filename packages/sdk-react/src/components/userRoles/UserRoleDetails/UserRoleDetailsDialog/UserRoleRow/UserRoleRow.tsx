import { useFormContext } from 'react-hook-form';

import { RHFCheckbox } from '@/components/RHF/RHFCheckbox';
import { getPermissionToLabelMap } from '@/components/userRoles/consts';
import { useLingui } from '@lingui/react';
import { components } from '@monite/sdk-api/src/api';
import {
  CheckRounded as CheckRoundedIcon,
  CloseRounded as CloseRoundedIcon,
} from '@mui/icons-material';
import { TableRow } from '@mui/material';

import { CommonActions, PayableActions, PermissionRow } from '../../types';
import { UserRoleDetailsView, StyledTableCell } from '../UserRoleDetailsDialog';

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
  view: UserRoleDetailsView;
}

interface ActionPermissionCellProps {
  view: UserRoleDetailsView;
  rowIndex: number;
  rowName?: string;
  action: keyof CommonActions | keyof PayableActions;
  actionPermissionValue: boolean | undefined;
}

const ActionPermissionCell = ({
  view,
  rowIndex,
  rowName,
  action,
  actionPermissionValue,
}: ActionPermissionCellProps) => {
  const { control } = useFormContext();

  if (typeof actionPermissionValue !== 'boolean') return null;

  if (view === UserRoleDetailsView.Mutate) {
    return (
      <RHFCheckbox
        control={control}
        name={`permissions[${rowIndex}][${action}]`}
        aria-label={`${rowName} ${action}`}
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
