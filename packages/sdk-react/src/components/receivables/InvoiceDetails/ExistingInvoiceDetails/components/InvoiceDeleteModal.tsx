import {
  useDeleteReceivableById,
  useReceivableById,
} from '@/core/queries/useReceivables';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

interface InvoiceDeleteModalProps {
  /** Receivable id */
  id: string;

  /** Is the modal open */
  open: boolean;

  /** Callback which fires when the user decided to close the modal or deletion was sucsessful */
  onClose: () => void;

  /** Callback to be called when the invoice is deleted */
  onDelete?: (id: string) => void;
}

export const InvoiceDeleteModal = ({
  id,
  open,
  onClose,
  onDelete,
}: InvoiceDeleteModalProps) => {
  const { i18n } = useLingui();
  const { data: receivable, isLoading: isReceivableLoading } =
    useReceivableById(id);

  const deleteMutation = useDeleteReceivableById(id);

  const handleConfirm = () => {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        onDelete?.(id);
        onClose();
      },
    });
  };

  if (!receivable && isReceivableLoading) {
    return null;
  }

  const title = receivable?.document_id
    ? t(i18n)`Delete receivable “${receivable.document_id}”?`
    : t(i18n)`Delete receivable?`;

  return (
    <ConfirmationModal
      open={open && Boolean(id)}
      title={title}
      message={t(i18n)`This action can’t be undone.`}
      confirmLabel={t(i18n)`Delete`}
      cancelLabel={t(i18n)`Cancel`}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={deleteMutation.isPending || isReceivableLoading}
    />
  );
};
