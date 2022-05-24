import React from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogContentText,
  Divider,
  Typography,
} from '@mui/material';

type ConfirmDeleteDialogueProps = {
  open: boolean;
  type: string;
  name: string;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const ConfirmDeleteDialogue = ({
  onClose,
  onDelete,
  type,
  name,
  isLoading,
  open,
}: ConfirmDeleteDialogueProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Dialog
      open={open}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Delete confirmation`}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle variant="h3">
        {t(i18n)`Delete ${type} “${name}“?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(i18n)`This action can't be undone.`}
        </DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button color="inherit" onClick={onClose} variant="outlined">
          {t(i18n)`Cancel`}
        </Button>
        <Button
          color="error"
          onClick={onDelete}
          disabled={isLoading}
          variant="outlined"
        >
          {t(i18n)`Delete`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
