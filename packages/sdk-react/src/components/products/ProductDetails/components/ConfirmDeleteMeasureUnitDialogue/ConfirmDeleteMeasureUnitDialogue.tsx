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
} from '@mui/material';

type ConfirmDeleteMeasureUnitDialogueProps = {
  open: boolean;
  name: string;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const ConfirmDeleteMeasureUnitDialogue = ({
  onClose,
  onDelete,
  name,
  isLoading,
  open,
}: ConfirmDeleteMeasureUnitDialogueProps) => {
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
        {t(i18n)`Delete "${name}" unit and associated items?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t(i18n)`All items with this measure unit will get deleted, too.`}
        </DialogContentText>
        <DialogContentText sx={{ fontWeight: 400 }}>
          {t(
            i18n
          )`Please replace the measure units in the products and services you want to keep.`}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={onClose} variant="text">
          {t(i18n)`Cancel`}
        </Button>
        <Button
          color="error"
          onClick={onDelete}
          disabled={isLoading}
          variant="contained"
        >
          {t(i18n)`Delete`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
