import { ConfirmationModal } from '@/components/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

type ProductCancelEditModalProps = {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
};

export const ProductCancelEditModal = ({
  open,
  onClose,
  onBack,
}: ProductCancelEditModalProps) => {
  const { i18n } = useLingui();

  return (
    <ConfirmationModal
      open={open}
      title={t(i18n)`You have unsaved changes`}
      message={t(
        i18n
      )`If you leave this page, you will lose all the changes you have made.`}
      confirmLabel={t(i18n)`Leave page`}
      cancelLabel={t(i18n)`Back`}
      onClose={onClose}
      onConfirm={onBack}
    />
  );
};
