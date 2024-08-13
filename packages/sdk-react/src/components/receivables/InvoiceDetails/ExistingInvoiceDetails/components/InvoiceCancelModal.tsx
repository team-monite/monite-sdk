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
  const cancelReceivableMutation = useCancelReceivableById(invoiceId);

  const creditNoteIds =
    receivable?.type === 'invoice'
      ? receivable.related_documents.credit_note_ids
      : undefined;

  const hasNoCreditNotes = !creditNoteIds?.length;

  const modalTitle = !receivable ? (
    <Skeleton />
  ) : receivable.document_id ? (
    t(i18n)`Cancel receivable "${receivable.document_id}"?`
  ) : (
    t(i18n)`Cancel receivable?`
  );

  const modalDescription = hasNoCreditNotes
    ? t(i18n)`This action can't be undone.`
    : t(
        i18n
      )`A Credit note has been issued for this invoice, so it cannot be canceled.`;

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
        {hasNoCreditNotes ? modalTitle : t(i18n)`Unable to Cancel`}
      </DialogTitle>
      <DialogContent>{modalDescription}</DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="inherit">
          {t(i18n)`Close`}
        </Button>
        {hasNoCreditNotes && (
          <Button
            variant="outlined"
            color="error"
            disabled={cancelReceivableMutation.isPending || isReceivableLoading}
            onClick={(event) => {
              event.preventDefault();
              cancelReceivableMutation.mutate(undefined, {
                onSuccess: onClose,
              });
            }}
            autoFocus
          >
            {t(i18n)`Cancel`}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
