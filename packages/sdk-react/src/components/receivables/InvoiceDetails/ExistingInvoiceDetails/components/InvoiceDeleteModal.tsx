import { useRootElements } from '@/core/context/RootElementsProvider';
import {
  useDeleteReceivableById,
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

interface InvoiceDeleteModalProps {
  /** Receivable id */
  id: string;

  /** Is the modal open */
  open: boolean;

  /** Callback which fires when the user decided to close the modal or deletion was sucsessful */
  onClose: () => void;
}

export const InvoiceDeleteModal = ({
  id,
  open,
  onClose,
}: InvoiceDeleteModalProps) => {
  const { i18n } = useLingui();
  const { root } = useRootElements();
  const { data: receivable, isLoading: isReceivableLoading } =
    useReceivableById(id);

  const deleteMutation = useDeleteReceivableById(id);

  return (
    <Dialog
      open={open && Boolean(id)}
      container={root}
      onClose={onClose}
      aria-label={t(i18n)`Invoice delete confirmation`}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle variant="h3">
        {!receivable ? (
          <Skeleton />
        ) : receivable.document_id ? (
          t(i18n)`Delete receivable "${receivable.document_id}"?`
        ) : (
          t(i18n)`Delete receivable?`
        )}
      </DialogTitle>
      <DialogContent>{t(i18n)`This action can't be undone.`}</DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="inherit">{t(
          i18n
        )`Cancel`}</Button>
        <Button
          variant="outlined"
          color="error"
          disabled={deleteMutation.isPending || isReceivableLoading}
          onClick={() => {
            deleteMutation.mutate(undefined, {
              onSuccess: onClose,
            });
          }}
          autoFocus
        >{t(i18n)`Delete`}</Button>
      </DialogActions>
    </Dialog>
  );
};
