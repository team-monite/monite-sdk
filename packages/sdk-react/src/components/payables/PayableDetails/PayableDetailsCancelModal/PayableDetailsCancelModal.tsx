import { ConfirmationModal } from '@/components/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

export interface PayableDetailsCancelModalProps {
  isOpen: boolean;
  handleCloseModal: () => void;
  handleConfirmation: () => void;
}

export const PayableDetailsCancelModal = ({
  isOpen,
  handleCloseModal,
  handleConfirmation,
}: PayableDetailsCancelModalProps) => {
  const { i18n } = useLingui();

  return (
    <ConfirmationModal
      open={isOpen}
      title={t(i18n)`Cancel bill?`}
      message={t(
        i18n
      )`The bill will receive the “Canceled” status and will require no payment. You can’t undo this action.`}
      confirmLabel={t(i18n)`Cancel bill`}
      cancelLabel={t(i18n)`Close`}
      onClose={handleCloseModal}
      onConfirm={() => {
        handleCloseModal();
        handleConfirmation();
      }}
    />
  );
};
