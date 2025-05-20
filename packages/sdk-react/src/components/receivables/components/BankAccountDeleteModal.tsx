import { ConfirmationModal } from '@/components/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

interface BankAccountDeleteModalProps {
  open: boolean;
  isDeleting: boolean;
  onClose: () => void;
  handleDelete: () => void;
}

export const BankAccountDeleteModal = ({
  open,
  isDeleting,
  onClose,
  handleDelete,
}: BankAccountDeleteModalProps) => {
  const { i18n } = useLingui();

  return (
    <ConfirmationModal
      open={open}
      title={t(i18n)`Delete bank account?`}
      message={t(
        i18n
      )`Draft or already issued invoices will keep this bank account. If required, you will need to manually update those invoices with new account information.`}
      confirmLabel={t(i18n)`Delete`}
      cancelLabel={t(i18n)`Cancel`}
      onClose={onClose}
      onConfirm={handleDelete}
      isLoading={isDeleting}
    />
  );
};
