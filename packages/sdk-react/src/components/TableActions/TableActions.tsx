import React, { useMemo } from 'react';

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
  Box,
  ListItemIcon,
  ListItemText,
} from '@mui/material';

export type ActionsPermissions = {
  isUpdateAllowed: boolean;
  isDeleteAllowed: boolean;
};

interface IActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  permissions: ActionsPermissions;
}

export const TableActions = ({
  onEdit,
  onDelete,
  permissions,
}: IActionsProps) => {
  const { getButtonProps, getMenuProps } = useMenuButton();

  const { i18n } = useLingui();
  const actions = useMemo(() => {
    const actionItems = [
      permissions.isUpdateAllowed && (
        <MenuItem key="products-table-edit-action" onClick={onEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t(i18n)`Edit`}</ListItemText>
        </MenuItem>
      ),
      permissions.isDeleteAllowed && (
        <MenuItem key="products-table-delete-action" onClick={onDelete}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t(i18n)`Delete`}</ListItemText>
        </MenuItem>
      ),
    ];

    return actionItems.filter(Boolean);
  }, [
    permissions.isUpdateAllowed,
    permissions.isDeleteAllowed,
    i18n,
    onDelete,
    onEdit,
  ]);

  if (actions.length === 0) {
    return null;
  }

  return (
    <Box>
      <IconButton {...getButtonProps()}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu {...getMenuProps()}>{actions}</Menu>
    </Box>
  );
};
