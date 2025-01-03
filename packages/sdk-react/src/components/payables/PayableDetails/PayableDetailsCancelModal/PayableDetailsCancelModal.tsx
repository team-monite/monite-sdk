import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Button,
} from '@mui/material';

export interface PayableDetailsCancelModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  handleConfirmation: () => void;
}

export const PayableDetailsCancelModal = ({
  isOpen,
  handleCloseModal,
  handleConfirmation,
}: PayableDetailsCancelModalProps) => {
  const { i18n } = useLingui();

  return (
    <Dialog open={isOpen} onClose={handleCloseModal}>
      <DialogTitle>{t(i18n)`Cancel bill?`}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t(
          i18n
        )`The bill will receive the “Canceled” status and will require no payment. You can't undo this action.`}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal}>{t(i18n)`Close`}</Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => {
            handleCloseModal();
            handleConfirmation();
          }}
        >
          {t(i18n)`Cancel bill`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
