import { useDeleteReceivableById } from '@/components/receivables/hooks/useDeleteReceivableById';
import { useComponentSettings } from '@/core/hooks/useComponentSettings';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { ConfirmationModal } from '@/ui/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

interface InvoiceDeleteModalProps {
  /** Open state */
  open: boolean;

  /** Callback to close the modal */
  onClose: () => void;

  /** Receivable id */
  invoiceId: string;

  /** Callback to be called when the invoice is deleted */
  onDelete?: () => void;

  /** Entity user id */
  entityUserId?: string;

  /** Receivable document id */
  documentId?: string;
}

export const InvoiceDeleteModal = ({
  open,
  onClose,
  invoiceId,
  onDelete,
  entityUserId,
  documentId,
}: InvoiceDeleteModalProps) => {
  const { i18n } = useLingui();
  const { receivablesCallbacks } = useComponentSettings();

  const { mutate: deleteInvoice, isPending: isDeletingReceivable } = useDeleteReceivableById(invoiceId);

  const { data: isDeleteAllowed, isLoading: isDeleteAllowedLoading } =
    useIsActionAllowed({
      method: 'receivable',
      action: 'delete',
      entityUserId,
    });

  const handleConfirm = () => {
    if (isDeleteAllowed){
      deleteInvoice(undefined, {
        onSuccess: () => {
          receivablesCallbacks?.onDelete?.(invoiceId);
          onDelete?.();
          onClose();
        },
      });
    } else {
      toast.error(
        t(i18n)`You don't have permission to delete this document. Please, contact your system administrator for details.`
      );
    }
  };

  const title = documentId
    ? t(i18n)`Delete receivable “${documentId}”?`
    : t(i18n)`Delete receivable?`;

  return (
    <ConfirmationModal
      open={open}
      title={title}
      message={t(i18n)`This action can't be undone.`}
      confirmLabel={t(i18n)`Delete`}
      cancelLabel={t(i18n)`Cancel`}
      onClose={onClose}
      onConfirm={handleConfirm}
      isLoading={isDeletingReceivable || isDeleteAllowedLoading}
    />
  );
};
