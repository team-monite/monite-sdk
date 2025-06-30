import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/components/dropdown-menu';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton } from '@mui/material';

export type ActionsPermissions = {
  isUpdateAllowed: boolean;
  isDeleteAllowed: boolean;
};

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  permissions: ActionsPermissions;
}

export const TableActions = ({
  onEdit,
  onDelete,
  permissions,
}: TableActionsProps) => {
  const { i18n } = useLingui();

  if (!(permissions.isUpdateAllowed || permissions.isDeleteAllowed)) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton aria-label="actions-menu-button">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {permissions.isUpdateAllowed && (
          <DropdownMenuItem onClick={onEdit}>
            <EditIcon fontSize="small" />
            {t(i18n)`Edit`}
          </DropdownMenuItem>
        )}
        {permissions.isDeleteAllowed && (
          <DropdownMenuItem onClick={onDelete}>
            <DeleteIcon fontSize="small" />
            {t(i18n)`Delete`}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
