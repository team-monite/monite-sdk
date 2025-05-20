import { components } from '@/api';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { usePaymentTermsApi } from './usePaymentTermsApi';

export interface DeletePaymentTermsProps {
  show: boolean;
  closeDialog: (payload: boolean) => void;
  paymentTermsId: components['schemas']['PaymentTermsResponse']['id'];
}

export const DeletePaymentTerms = ({
  show,
  closeDialog,
  paymentTermsId,
}: DeletePaymentTermsProps) => {
  const { deletePaymentTerm } = usePaymentTermsApi({
    onSuccessfullChange: () => closeDialog(true),
  });

  const { i18n } = useLingui();

  return (
    <ConfirmationModal
      open={show}
      title={t(i18n)`Delete payment term?`}
      message={t(
        i18n
      )`You won’t be able to use it to create new invoices, but it won’t affect the existing invoices with this term and their future copies.`}
      confirmLabel={t(i18n)`Delete`}
      cancelLabel={t(i18n)`Cancel`}
      onClose={() => closeDialog(false)}
      onConfirm={() => deletePaymentTerm(paymentTermsId)}
    />
  );
};
