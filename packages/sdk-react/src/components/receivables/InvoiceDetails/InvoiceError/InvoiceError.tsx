import { useDialog } from '@/components/Dialog';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import CloseIcon from '@mui/icons-material/Close';
import {
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Divider,
  DialogContent,
} from '@mui/material';

export const InvoiceError = ({
  onClose,
  errorMessage,
}: {
  onClose?: () => void;
  errorMessage: string | undefined;
}) => {
  const dialogContext = useDialog();

  return (
    <>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography variant="h3">
              {t(i18n)`Something went wrong`}
            </Typography>
          </Box>
          {dialogContext?.isDialogContent && (
            <IconButton
              aria-label={t(i18n)`Close invoice details`}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box display="flex">{errorMessage}</Box>
      </DialogContent>
    </>
  );
};
