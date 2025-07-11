import { useDialog } from '@/ui/Dialog';
import { IconWrapper } from '@/ui/iconWrapper';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from '@mui/material';

export const InvoiceError = ({
  onClose,
  errorMessage,
}: {
  onClose?: () => void;
  errorMessage: string | undefined;
}) => {
  const dialogContext = useDialog();
  const { i18n } = useLingui();

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
            <IconWrapper
              aria-label={t(i18n)`Close invoice details`}
              onClick={onClose}
            >
              <CloseIcon />
            </IconWrapper>
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
