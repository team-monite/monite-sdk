import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useCancelReceivableById,
  useReceivableById,
} from '@/core/queries/useReceivables';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Skeleton,
} from '@mui/material';

interface InvoiceCancelModalProps {
  invoiceId: string;
  open: boolean;
  onClose: () => void;
}

export const InvoiceCancelModal = ({
  invoiceId,
  open,
  onClose,
}: InvoiceCancelModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { data: receivable, isLoading: isReceivableLoading } =
    useReceivableById(invoiceId);

  const cancelMutation = useCancelReceivableById(invoiceId);

  return (
    <Dialog
      open={open && Boolean(invoiceId)}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Invoice cancel confirmation`}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle variant="h3">
        {!receivable ? (
          <Skeleton />
        ) : receivable.document_id ? (
          t(i18n)`Cancel receivable "${receivable.document_id}"?`
        ) : (
          t(i18n)`Cancel receivable?`
        )}
      </DialogTitle>
      <DialogContent>{t(i18n)`This action can't be undone.`}</DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="inherit">{t(
          i18n
        )`Close`}</Button>
        <Button
          variant="outlined"
          color="error"
          disabled={cancelMutation.isPending || isReceivableLoading}
          onClick={(event) => {
            event.preventDefault();
            cancelMutation.mutate(undefined, {
              onSuccess: onClose,
            });
          }}
          autoFocus
        >{t(i18n)`Cancel`}</Button>
      </DialogActions>
    </Dialog>
  );
};
