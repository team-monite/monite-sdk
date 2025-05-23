import {
  useCancelReceivableById,
  useReceivableById,
} from '@/core/queries/useReceivables';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

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
  const { data: receivable, isLoading: isReceivableLoading } =
    useReceivableById(invoiceId);
  const cancelReceivableMutation = useCancelReceivableById(invoiceId);

  const creditNoteIds =
    receivable?.type === 'invoice'
      ? receivable.related_documents.credit_note_ids
      : undefined;

  const hasNoCreditNotes = !creditNoteIds?.length;

  if (!receivable) {
    return null;
  }

  const modalTitle = receivable.document_id
    ? t(i18n)`Cancel receivable “${receivable?.document_id}”?`
    : t(i18n)`Cancel receivable?`;

  const modalDescription = hasNoCreditNotes
    ? t(
        i18n
      )`The Credit note to this invoice “${receivable?.document_id}” was created earlier. Following that you can’t cancel invoice.`
    : t(i18n)`This action can't be undone.`;

  return (
    <ConfirmationModal
      open={open && Boolean(invoiceId)}
      title={
        hasNoCreditNotes ? modalTitle : t(i18n)`Unfortunately, you can’t cancel`
      }
      message={modalDescription}
      confirmLabel={t(i18n)`Cancel`}
      cancelLabel={t(i18n)`Close`}
      onClose={onClose}
      onConfirm={() => {
        cancelReceivableMutation.mutate(undefined, {
          onSuccess: onClose,
        });
      }}
      isLoading={cancelReceivableMutation.isPending || isReceivableLoading}
    />
  );
};
