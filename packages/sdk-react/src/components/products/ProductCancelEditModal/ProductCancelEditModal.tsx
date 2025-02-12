import { useRootElements } from '@/core/context/RootElementsProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

type ProductCancelEditModalProps = {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
};

export const ProductCancelEditModal = ({
  open,
  onClose,
  onBack,
}: ProductCancelEditModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Dialog
      open={open}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`You have unsaved changes`}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle variant="h3">
        {t(i18n)`You have unsaved changes`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText variant="body1">
          {t(
            i18n
          )`If you leave this page, you will lose all the changes you have made.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onClose} color="primary">
          {t(i18n)`Back`}
        </Button>
        <Button variant="contained" color="error" onClick={onBack} autoFocus>
          {t(i18n)`Leave page`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
