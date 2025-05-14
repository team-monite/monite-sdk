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
} from '@mui/material';

type ConfirmDeleteDialogProps = {
  open: boolean;
  type: string;
  name: string;
  isLoading: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export const ConfirmDeleteDialog = ({
  onClose,
  onDelete,
  type,
  name,
  isLoading,
  open,
}: ConfirmDeleteDialogProps) => {
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
      <MoniteDialogTitle>
        {t(i18n)`Delete ${type} “${name}“?`}
      </MoniteDialogTitle>
      <MoniteDialogContent>
        <DialogContentText>
          {t(i18n)`You can't undo this action.`}
        </DialogContentText>
      </MoniteDialogContent>
      <MoniteDialogActions>
        <Stack direction="row" spacing={2}>
          <Button onClick={onClose} disabled={isLoading} autoFocus>
            {t(i18n)`Cancel`}
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={onDelete}
            disabled={isLoading}
          >
            {t(i18n)`Delete`}
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
