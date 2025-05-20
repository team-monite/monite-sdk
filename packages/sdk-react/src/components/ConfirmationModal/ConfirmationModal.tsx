import { ReactNode } from 'react';

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
  Stack,
  styled,
  CircularProgress,
} from '@mui/material';

type BaseConfirmationModalProps = {
  open: boolean;
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

type MessageConfirmationModalProps = BaseConfirmationModalProps & {
  message: string;
  children?: never;
};

type ChildrenConfirmationModalProps = BaseConfirmationModalProps & {
  message?: never;
  children: ReactNode;
};

type ConfirmationModalProps =
  | MessageConfirmationModalProps
  | ChildrenConfirmationModalProps;

export const ConfirmationModal = ({
  open,
  title,
  message,
  children,
  confirmLabel,
  cancelLabel,
  onClose,
  onConfirm,
  isLoading = false,
}: ConfirmationModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  return (
    <Dialog
      open={open}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Confirmation dialog`}
      fullWidth
      maxWidth="sm"
    >
      <MoniteDialogTitle>{title}</MoniteDialogTitle>
      <MoniteDialogContent>
        {message ? <DialogContentText>{message}</DialogContentText> : children}
      </MoniteDialogContent>
      <MoniteDialogActions>
        <Stack direction="row" spacing={2}>
          <Button onClick={onClose} autoFocus disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={onConfirm}
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : undefined
            }
          >
            {confirmLabel}
          </Button>
        </Stack>
      </MoniteDialogActions>
    </Dialog>
  );
};

const MoniteDialogTitle = styled(DialogTitle)(({ theme }) => ({
  '&.MuiDialogTitle-root.MuiTypography-root': {
    ...theme.typography.h3, // MUI v5 styles DialogTitle as H2. This is a workaround to apply H3 styles
    padding: '2rem 2rem 1.5rem',
  },
}));

const MoniteDialogContent = styled(DialogContent)(() => ({
  padding: '1rem 2rem',
}));

const MoniteDialogActions = styled(DialogActions)(() => ({
  padding: '1.7rem 2rem',
}));
