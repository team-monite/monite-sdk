import React, { useCallback, useMemo } from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { useMenu } from '@/core/hooks';
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
  const { open, handleOpen, handleClose, anchorEl } = useMenu();

  const handleEdit = useCallback(() => {
    handleClose();
    onEdit();
  }, [handleClose, onEdit]);

  const handleDelete = useCallback(() => {
    handleClose();
    onDelete();
  }, [handleClose, onDelete]);

  const { i18n } = useLingui();
  const actions = useMemo(() => {
    const actionItems = [
      permissions.isUpdateAllowed && (
        <MenuItem key="products-table-edit-action" onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t(i18n)`Edit`}</ListItemText>
        </MenuItem>
      ),
      permissions.isDeleteAllowed && (
        <MenuItem key="products-table-delete-action" onClick={handleDelete}>
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
    handleEdit,
    i18n,
    handleDelete,
  ]);

  const { root } = useRootElements();

  if (actions.length === 0) {
    return null;
  }

  return (
    <Box>
      <IconButton
        id="actions"
        aria-controls={open ? 'actions-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-label="actions-menu-button"
        onClick={(event) => {
          event.stopPropagation();
          handleOpen(event);
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        id="actions"
        open={open}
        container={root}
        onClose={handleClose}
        anchorEl={anchorEl}
        MenuListProps={{
          'aria-labelledby': 'actions',
        }}
      >
        {actions}
      </Menu>
    </Box>
  );
};
