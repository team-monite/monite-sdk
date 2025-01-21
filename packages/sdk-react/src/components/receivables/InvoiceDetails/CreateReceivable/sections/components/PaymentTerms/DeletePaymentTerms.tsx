import { components } from '@/api';
import { Dialog } from '@/components';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';

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

  return (
    <Dialog open={show}>
      <DialogTitle>{t(i18n)`Delete payment term?`}</DialogTitle>
      <DialogContent>
        {t(
          i18n
        )`You won't be able to use it to create new invoices, but it won't affect the existing invoices with this term and their future copies.`}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => closeDialog(false)}>{t(
          i18n
        )`Cancel`}</Button>
        <Button
          variant="outlined"
          color="error"
          onClick={() => deletePaymentTerm(paymentTermsId)}
        >
          {t(i18n)`Delete`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
