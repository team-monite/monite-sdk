import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';

interface BankAccountDeleteModalProps {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  handleDelete: () => void;
}

export const BankAccountDeleteModal = ({
  open,
  isDeleting,
  onClose,
  handleDelete,
}: BankAccountDeleteModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Dialog
      open={open}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Bank account delete confirmation`}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle variant="h3">{t(i18n)`Delete bank account?`}</DialogTitle>
      <DialogContent>{t(
        i18n
      )`You might need to update draft documents created with this bank account to ensure a correct payment.`}</DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="inherit">{t(
          i18n
        )`Cancel`}</Button>
        <Button
          variant="contained"
          color="error"
          disabled={isDeleting}
          onClick={handleDelete}
          autoFocus
        >{t(i18n)`Delete`}</Button>
      </DialogActions>
    </Dialog>
  );
};
