import React from 'react';
import { toast } from 'react-hot-toast';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useDeleteTagMutation } from '@/core/queries/useTag';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDeleteModalProps {
  /** The tag what we want to delete */
  tag: { id: string; name: string };

  /**
   * Callback which fires when the user
   *  decided to close the modal
   *  or deletion was successful
   */
  onClose: () => void;

  /** Callback which fires when the tag has been deleted */
  onDelete?: (tagId: string) => void;

  modalOpened: boolean;
}

export const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => (
  <MoniteScopedProviders>
    <ConfirmDeleteModalBase {...props} />
  </MoniteScopedProviders>
);

const ConfirmDeleteModalBase = ({
  tag,
  onClose,
  onDelete,
  modalOpened,
}: ConfirmDeleteModalProps) => {
  const { i18n } = useLingui();
  const deleteTagMutation = useDeleteTagMutation(tag?.id);

  const handleDelete = () => {
    deleteTagMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t(i18n)`Tag “${tag.name}” was deleted`);

        onClose?.();
        onDelete?.(tag.id);
      },
    });
  };
  const { root } = useRootElements();

  return (
    <>
      <Dialog
        open={modalOpened}
        container={root}
        onClose={onClose}
        aria-label={t(i18n)`Delete tag`}
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle variant="h3">
          {t(i18n)`Delete "${tag.name}" tag?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t(i18n)`This action can't be undone.`}
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={onClose}>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            autoFocus
          >
            {t(i18n)`Delete`}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
