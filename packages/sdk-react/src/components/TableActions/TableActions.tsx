import React from 'react';

import { useMenuButton } from '@/core/hooks';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

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
  const { getButtonProps, getMenuProps } = useMenuButton();

  const { i18n } = useLingui();

  if (!(permissions.isUpdateAllowed || permissions.isDeleteAllowed)) {
    return null;
  }

  return (
    <>
      <IconButton aria-label="actions-menu-button" {...getButtonProps()}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu {...getMenuProps()}>
        {permissions.isUpdateAllowed && (
          <MenuItem onClick={onEdit}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t(i18n)`Edit`}</ListItemText>
          </MenuItem>
        )}

        {permissions.isDeleteAllowed && (
          <MenuItem onClick={onDelete}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t(i18n)`Delete`}</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
