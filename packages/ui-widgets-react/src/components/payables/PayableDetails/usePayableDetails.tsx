import { useCallback, useEffect, useRef, useState } from 'react';
import { PayableStateEnum } from '@monite/js-sdk';
import {
  // useApprovePayableById,
  usePayableById,
  // useUpdatePayableById,
} from 'core/queries/usePayable';

export type UsePayableDetailsProps = {
  id: string;
  debug?: boolean;
  onSubmit?: () => void;
  onSave?: () => void;
  onPay?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
};

export type PayableDetailsPermissions =
  | 'save'
  | 'submit'
  | 'reject'
  | 'approve'
  | 'pay';

export default function usePayableDetails({
  id,
  debug,
  onSubmit,
  onSave,
  onReject,
  onApprove,
  onPay,
}: UsePayableDetailsProps) {
  const { data: payable, error, isLoading } = usePayableById(id, debug);

  const formRef = useRef<HTMLFormElement>(null);

  const [isEdit, setEdit] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<PayableDetailsPermissions[]>(
    []
  );

  // const approveMutation = useApprovePayableById();

  const status = payable?.status || '';

  useEffect(() => {
    if (!status) return;

    setEdit(false);
    setPermissions([]);

    switch (status) {
      case PayableStateEnum.NEW:
        setPermissions(['save', 'submit']);
        setEdit(true);
        break;
      case PayableStateEnum.APPROVE_IN_PROGRESS:
        setPermissions(['reject', 'approve']);
        break;
      case PayableStateEnum.WAITING_TO_BE_PAID:
        setPermissions(['pay']);
        break;
    }
  }, [status]);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const submitInvoice = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const saveInvoice = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const approveInvoice = useCallback(() => {
    onApprove && onApprove();
  }, []);

  const rejectInvoice = useCallback(() => {
    onReject && onReject();
  }, []);

  const payInvoice = useCallback(() => {
    onPay && onPay();
  }, []);

  const onFormSubmit = useCallback(() => {
    // TODO separate onSubmit and onSave after fetch
    onSubmit && onSubmit();
    onSave && onSave();
  }, []);

  return {
    payable,
    formRef,
    isLoading,
    error,
    isEdit,
    permissions,
    actions: {
      onFormSubmit,
      submitInvoice,
      saveInvoice,
      approveInvoice,
      rejectInvoice,
      payInvoice,
    },
  };
}
